import { z } from "zod";

export const refundValidation = {
     createRefund: z.object({
          body: z.object({
               orderId: z.string({ required_error: "Order ID is required" }),
               amount: z.number({ required_error: "Amount is required" }).positive(),
               reason: z.string({ required_error: "Reason is required" }).min(5),
          }),
     }),
     chefReview: z.object({
          body: z.object({
               action: z.enum(["APPROVE", "REJECT"], { required_error: "Action is required" }),
               note: z.string().optional(),
          }),
     }),
     adminReview: z.object({
          body: z.object({
               action: z.enum(["APPROVE", "REJECT"], { required_error: "Action is required" }),
               note: z.string().optional(),
          }),
     }),
};
