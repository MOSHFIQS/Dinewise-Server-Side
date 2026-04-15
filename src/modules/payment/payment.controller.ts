import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await paymentService.createPaymentIntent(req.params.orderId, (req as any).user.id);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Payment intent created", data: result });
     } catch (e) {
          next(e);
     }
};

const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
     try {
          // In a real app, you should verify the Stripe webhook signature here
          await paymentService.handleWebhook(req.body);
          res.json({ received: true });
     } catch (e) {
          next(e);
     }
};

const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { paymentIntentId } = req.body;
          const result = await paymentService.verifyPayment(paymentIntentId);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Payment verified", data: result });
     } catch (e) {
          next(e);
     }
};

const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await paymentService.getAllPayments(req.query as any);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Payments fetched", data: result });
     } catch (e) {
          next(e);
     }
};

export const paymentController = { createPaymentIntent, handleWebhook, getAllPayments, verifyPayment };
