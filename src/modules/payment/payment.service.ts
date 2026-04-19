import { prisma } from "../../lib/prisma";
import Stripe from "stripe";
import { envVars } from "../../config/env";
import { PaymentStatus, OrderStatus } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

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

          await prisma.$transaction(async (tx) => {
               await tx.payment.update({
                    where: { orderId },
                    data: { status: PaymentStatus.SUCCESS, transactionId: paymentIntent.id },
               });
               await tx.order.update({
                    where: { id: orderId },
                    data: { status: OrderStatus.CONFIRMED },
               });
          }, {
               timeout: 10000,
               maxWait: 5000,
          });
     } else if (event.type === "payment_intent.payment_failed") {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const orderId = paymentIntent.metadata.orderId;

          await prisma.payment.update({
               where: { orderId },
               data: { status: PaymentStatus.FAILED },
          });
     }
};

const verifyPayment = async (paymentIntentId: string) => {
     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

     if (paymentIntent.status === "succeeded") {
          const orderId = paymentIntent.metadata.orderId;

          const result = await prisma.$transaction(async (tx) => {
               const payment = await tx.payment.upsert({
                    where: { orderId },
                    update: { status: PaymentStatus.SUCCESS, transactionId: paymentIntent.id },
                    create: { orderId, amount: paymentIntent.amount / 100, status: PaymentStatus.SUCCESS, transactionId: paymentIntent.id },
               });
               const order = await tx.order.update({
                    where: { id: orderId },
                    data: { status: OrderStatus.CONFIRMED },
               });
               return { payment, order };
          }, {
               timeout: 10000, // 10 seconds for resilience
               maxWait: 5000,  // Wait up to 5s to acquire a connection
          });
          return result;
     } else {
          throw new Error("Payment not succeeded yet");
     }
};

const getAllPayments = async (query: IQueryParams) => {
     const paymentQuery = new QueryBuilder(prisma.payment, query)
          .search()
          .filter()
          .sort()
          .paginate();

     return paymentQuery
          .include({ order: { select: { customer: { select: { name: true, email: true } } } } })
          .execute();
};

export const paymentService = { createPaymentIntent, handleWebhook, getAllPayments, verifyPayment };
