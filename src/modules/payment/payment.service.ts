import { prisma } from "../../lib/prisma";
import Stripe from "stripe";
import { envVars } from "../../config/env";
import { PaymentStatus, OrderStatus } from "../../../generated/prisma/enums";

const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY, {
     apiVersion: "2025-02-24.acacia",
});

const createPaymentIntent = async (orderId: string, userId: string) => {
     const order = await prisma.order.findUnique({
          where: { id: orderId },
     });
     if (!order) throw new Error("Order not found");
     if (order.customerId !== userId) throw new Error("Unauthorized");
     if (order.status !== OrderStatus.PLACED) throw new Error("Order already processed");

     const amount = Math.round(order.totalPrice * 100); // Stripe expects cents

     const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "usd",
          metadata: { orderId },
     });

     await prisma.payment.upsert({
          where: { orderId },
          update: { amount: order.totalPrice, status: PaymentStatus.INITIATED },
          create: {
               orderId,
               amount: order.totalPrice,
               status: PaymentStatus.INITIATED,
          },
     });

     return { clientSecret: paymentIntent.client_secret, orderId };
};

const handleWebhook = async (event: any) => {
     if (event.type === "payment_intent.succeeded") {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const orderId = paymentIntent.metadata.orderId;

          await prisma.$transaction([
               prisma.payment.update({
                    where: { orderId },
                    data: { status: PaymentStatus.SUCCESS, transactionId: paymentIntent.id },
               }),
               prisma.order.update({
                    where: { id: orderId },
                    data: { status: OrderStatus.CONFIRMED },
               }),
          ]);
     } else if (event.type === "payment_intent.payment_failed") {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const orderId = paymentIntent.metadata.orderId;

          await prisma.payment.update({
               where: { orderId },
               data: { status: PaymentStatus.FAILED },
          });
     }
};

const getAllPayments = async () => {
     return prisma.payment.findMany({
          orderBy: { createdAt: "desc" },
          include: { order: { select: { customer: { select: { name: true, email: true } } } } },
     });
};

export const paymentService = { createPaymentIntent, handleWebhook, getAllPayments };
