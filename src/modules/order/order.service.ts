import { prisma } from "../../lib/prisma";
import { OrderStatus, Role } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

interface CreateOrderPayload {
     addressId?: string;
     addressSnapshot?: any;
     couponId?: string;
     notes?: string;
     tableNumber?: string;
     items: {
          menuItemId: string;
          quantity: number;
     }[];
}

const placeOrder = async (customerId: string, payload: CreateOrderPayload) => {
     return await prisma.$transaction(async (tx) => {
          let subtotal = 0;
          let deliveryFee = 5; // Fixed for now, can be dynamic
          let couponDiscount = 0;

          const orderItems = [];
          
          // Bulk fetch all menu items to minimize sequential lookups inside the transaction
          const itemIds = payload.items.map(i => i.menuItemId);
          const menuItems = await tx.menuItem.findMany({
               where: { id: { in: itemIds } }
          });

          // Create a map for quick lookup
          const menuItemMap = new Map(menuItems.map(item => [item.id, item]));

          for (const item of payload.items) {
               const menuItem = menuItemMap.get(item.menuItemId);
               
               if (!menuItem || !menuItem.isActive) {
                    throw new Error(`Menu item ${item.menuItemId} is unavailable`);
               }
               
               if (menuItem.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${menuItem.name}`);
               }

               const unitPrice = menuItem.discountPrice || menuItem.price;
               const totalPrice = unitPrice * item.quantity;
               subtotal += totalPrice;

               // Still perform atomic stock updates
               await tx.menuItem.update({
                    where: { id: item.menuItemId },
                    data: { stock: { decrement: item.quantity } },
               });

               orderItems.push({
                    menuItemId: item.menuItemId,
                    menuItemName: menuItem.name,
                    menuItemImage: menuItem.images[0] || null,
                    quantity: item.quantity,
                    unitPrice,
                    totalPrice,
               });
          }

          if (payload.couponId) {
               const coupon = await tx.coupon.findUnique({ where: { id: payload.couponId } });
               if (!coupon || !coupon.isActive || coupon.validUntil < new Date()) {
                    throw new Error("Invalid or expired coupon");
               }
               if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
                    throw new Error(`Minimum order value to use this coupon is $${coupon.minOrderValue}`);
               }

               if (coupon.discountType === "FIXED") {
                    couponDiscount = coupon.discountValue;
               } else if (coupon.discountType === "PERCENTAGE") {
                    couponDiscount = (subtotal * coupon.discountValue) / 100;
               }

               await tx.coupon.update({
                    where: { id: payload.couponId },
                    data: { usedCount: { increment: 1 } },
               });
          }

          const tax = (subtotal - couponDiscount) * 0.1; // 10% tax
          const finalTotal = subtotal - couponDiscount + deliveryFee + tax;

          const order = await tx.order.create({
               data: {
                    customerId,
                    addressId: payload.addressId,
                    addressSnapshot: payload.addressSnapshot,
                    couponId: payload.couponId,
                    couponDiscount,
                    subtotal,
                    deliveryFee,
                    tax,
                    totalPrice: finalTotal,
                    notes: payload.notes,
                    tableNumber: payload.tableNumber,
                    items: {
                         create: orderItems,
                    },
               },
               include: { items: true },
          });

          return order;
     }, {
          maxWait: 20000, // 20 seconds to acquire a connection
          timeout: 30000, // 30 seconds total execution time
     });
};

const getCustomerOrders = async (customerId: string, query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.order, query, {
          filterableFields: ["status"],
     });
     return qb.where({ customerId }).include({ items: true }).sort().paginate().execute();
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
     return prisma.order.update({
          where: { id },
          data: { status },
     });
};

const getOrderById = async (id: string) => {
     const order = await prisma.order.findUnique({
          where: { id },
          include: { items: true, customer: { select: { id: true, name: true, email: true, phone: true } } },
     });
     if (!order) throw new Error("Order not found");
     return order;
};

const getAllOrders = async (query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.order, query, {
          filterableFields: ["status", "customerId"],
     });
     return qb
          .include({
               customer: { select: { id: true, name: true, phone: true } },
               items: true,
          })
          .sort()
          .paginate()
          .execute();
};

const getChefOrders = async (chefId: string, query: IQueryParams = {}) => {
     return getAllOrders(query); 
};

export const orderService = {
     placeOrder,
     getCustomerOrders,
     updateOrderStatus,
     getOrderById,
     getAllOrders,
     getChefOrders,
};
