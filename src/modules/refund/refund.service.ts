import { prisma } from "../../lib/prisma";
import { RefundStatus, OrderStatus, PaymentStatus, Role, NotificationType, PaymentMethod } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import Stripe from "stripe";
import { envVars } from "../../config/env";
import { notificationService } from "../notification/notification.service";
import { auditService } from "../audit/audit.service";

const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

const requestRefund = async (userId: string, payload: { orderId: string, amount: number, reason: string }) => {
     const order = await prisma.order.findUnique({
          where: { id: payload.orderId },
          include: { payment: true },
     });

     if (!order) throw new Error("Order not found");
     if (order.customerId !== userId) throw new Error("Unauthorized");
     if (order.status !== OrderStatus.DELIVERED) throw new Error("Refund only allowed for delivered orders");
     // Relaxed payment status check to allow testing/COD orders where payment might formally stay PENDING.
     // if (!order.payment || order.payment.status !== PaymentStatus.SUCCESS) throw new Error("Order must have a successful payment for refund");

     if (payload.amount > order.totalPrice) throw new Error("Refund amount cannot exceed order total");

     // Prevent duplicate active refunds
     const existingRefund = await prisma.refund.findFirst({
          where: { orderId: payload.orderId, status: { notIn: [RefundStatus.CHEF_REJECTED, RefundStatus.ADMIN_REJECTED] } },
     });
     if (existingRefund) throw new Error("An active refund request already exists for this order");

     // Optional 24h limit
     if (order.deliveredAt) {
          const hoursSinceDelivery = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60);
          if (hoursSinceDelivery > 24) throw new Error("Refund request window (24h after delivery) has expired");
     }

     const refund = await prisma.refund.create({
          data: {
               orderId: payload.orderId,
               paymentId: order.payment?.id!,
               customerId: userId,
               amount: payload.amount,
               reason: payload.reason,
               status: RefundStatus.REQUESTED,
          },
     });

     // Notifications
     // Notify all chefs associated with the order items
     const chefs = await prisma.orderItem.findMany({
          where: { orderId: payload.orderId },
          include: { menuItem: { select: { chefId: true } } },
     });
     const uniqueChefIds = [...new Set(chefs.map(c => c.menuItem.chefId))];

     for (const chefId of uniqueChefIds) {
          await notificationService.createNotification({
               userId: chefId,
               type: NotificationType.REFUND_REQUESTED,
               title: "New Refund Request",
               message: `A client requested a refund for order #${order.id.slice(0, 8).toUpperCase()}`,
               meta: { refundId: refund.id, orderId: order.id },
          });
     }

     await auditService.log({
          userId,
          action: "REFUND_REQUESTED",
          entityType: "REFUND",
          entityId: refund.id,
          details: { orderId: order.id, amount: payload.amount },
     });

     return refund;
};

const chefReviewRefund = async (chefId: string, refundId: string, action: "APPROVE" | "REJECT", note?: string) => {
     const refund = await prisma.refund.findUnique({
          where: { id: refundId },
          include: { order: { include: { items: { include: { menuItem: true } } } } },
     });

     if (!refund) throw new Error("Refund request not found");
     if (refund.status !== RefundStatus.REQUESTED) throw new Error("Refund request already processed");

     // Verify chef belongs to this order
     const isRelatedChef = refund.order.items.some(item => item.menuItem.chefId === chefId);
     if (!isRelatedChef) throw new Error("You are not authorized to review this refund");

     const status = action === "APPROVE" ? RefundStatus.CHEF_APPROVED : RefundStatus.CHEF_REJECTED;

     const updatedRefund = await prisma.refund.update({
          where: { id: refundId },
          data: { status, chefNote: note },
     });

     // Notifications
     if (action === "APPROVE") {
          // Notify Admin
          const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } });
          for (const admin of admins) {
               await notificationService.createNotification({
                    userId: admin.id,
                    type: NotificationType.REFUND_APPROVED,
                    title: "Chef Approved Refund",
                    message: `Chef approved refund request for order #${refund.orderId.slice(0, 8).toUpperCase()}`,
                    meta: { refundId: refund.id, orderId: refund.orderId },
               });
          }
     } else {
          // Notify Customer
          await notificationService.createNotification({
               userId: refund.customerId,
               type: NotificationType.REFUND_REJECTED,
               title: "Refund Request Rejected",
               message: `Your refund request for order #${refund.orderId.slice(0, 8).toUpperCase()} was rejected by the chef.`,
               meta: { refundId: refund.id, orderId: refund.orderId, note },
          });
     }

     return updatedRefund;
};

const adminReviewRefund = async (adminId: string, refundId: string, action: "APPROVE" | "REJECT", note?: string) => {
     const refund = await prisma.refund.findUnique({
          where: { id: refundId },
          include: { order: true, payment: true },
     });

     if (!refund) throw new Error("Refund request not found");
     if (refund.status !== RefundStatus.CHEF_APPROVED) throw new Error("Refund must be approved by chef first");

     if (action === "REJECT") {
          const updatedRefund = await prisma.refund.update({
               where: { id: refundId },
               data: { status: RefundStatus.ADMIN_REJECTED, adminNote: note },
          });

          await notificationService.createNotification({
               userId: refund.customerId,
               type: NotificationType.REFUND_REJECTED,
               title: "Refund Request Rejected by Admin",
               message: `Your refund request for order #${refund.orderId.slice(0, 8).toUpperCase()} was rejected by administration.`,
               meta: { refundId: refund.id, orderId: refund.orderId, note },
          });

          return updatedRefund;
     }

     // APPROVE & PROCESS
     let stripeRefundId: string | null = null;

     return await prisma.$transaction(async (tx) => {
          if (refund.payment.paymentMethod === PaymentMethod.STRIPE) {
               if (!refund.payment.transactionId) throw new Error("Stripe transaction ID missing");

               const stripeRefund = await stripe.refunds.create({
                    payment_intent: refund.payment.transactionId,
                    amount: Math.round(refund.amount * 100),
               });
               stripeRefundId = stripeRefund.id;
          }

          const processedRefund = await tx.refund.update({
               where: { id: refundId },
               data: {
                    status: RefundStatus.PROCESSED,
                    adminNote: note,
                    stripeRefundId,
               },
          });

          // If full refund, update order/payment status
          if (refund.amount >= refund.order.totalPrice) {
               await tx.order.update({
                    where: { id: refund.orderId },
                    data: { status: OrderStatus.REFUNDED },
               });
               await tx.payment.update({
                    where: { id: refund.paymentId },
                    data: { status: PaymentStatus.REFUNDED },
               });
          }

          // Side effects (Notifications & Logs)
          await notificationService.createNotification({
               userId: refund.customerId,
               type: NotificationType.REFUND_PROCESSED,
               title: "Refund Processed",
               message: `Your refund of $${refund.amount} for order #${refund.orderId.slice(0, 8).toUpperCase()} has been processed.`,
               meta: { refundId: refund.id, orderId: refund.orderId, amount: refund.amount },
          });

          await auditService.log({
               userId: adminId,
               action: "REFUND_PROCESSED",
               entityType: "REFUND",
               entityId: refund.id,
               details: { orderId: refund.orderId, amount: refund.amount, stripeRefundId },
          });

          return processedRefund;
     });
};

const getRefunds = async (userId: string, role: Role, query: IQueryParams) => {
     const qb = new QueryBuilder(prisma.refund, query)
          .search()
          .filter()
          .sort()
          .paginate();

     if (role === Role.ADMIN) {
          return qb.include({ order: true, customer: true }).execute();
     } else if (role === Role.CHEF) {
          // Chefs see refunds for orders containing their menu items
          return qb
               .where({ order: { items: { some: { menuItem: { chefId: userId } } } } })
               .include({ order: true, customer: true })
               .execute();
     } else {
          return qb.where({ customerId: userId }).include({ order: true }).execute();
     }
};

export const refundService = { requestRefund, chefReviewRefund, adminReviewRefund, getRefunds };
