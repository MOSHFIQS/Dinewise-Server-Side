import { Request, Response, NextFunction } from "express";
import { refundService } from "./refund.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const requestRefund = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await refundService.requestRefund((req as any).user.id, req.body, {
               ipAddress: req.ip,
               userAgent: req.headers["user-agent"]
          });
          sendResponse(res, {
               statusCode: httpStatus.CREATED,
               success: true,
               message: "Refund requested successfully",
               data: result,
          });
     } catch (e) {
          next(e);
     }
};

const chefReviewRefund = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params;
          const { action, note } = req.body;
          const result = await refundService.chefReviewRefund((req as any).user.id, id as string, action, note);
          sendResponse(res, {
               statusCode: httpStatus.OK,
               success: true,
               message: `Refund ${action.toLowerCase()}ed by chef`,
               data: result,
          });
     } catch (e) {
          next(e);
     }
};

const adminReviewRefund = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { id } = req.params;
          const { action, note } = req.body;
          const result = await refundService.adminReviewRefund((req as any).user.id, id as string, action, note, {
               ipAddress: req.ip,
               userAgent: req.headers["user-agent"]
          });
          sendResponse(res, {
               statusCode: httpStatus.OK,
               success: true,
               message: action === "APPROVE" ? "Refund processed successfully" : "Refund rejected by admin",
               data: result,
          });
     } catch (e) {
          next(e);
     }
};

const getRefunds = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await refundService.getRefunds((req as any).user.id, (req as any).user.role, req.query as any);
          sendResponse(res, {
               statusCode: httpStatus.OK,
               success: true,
               message: "Refunds fetched successfully",
               meta: result.meta,
               data: result.data,
          });
     } catch (e) {
          next(e);
     }
};

export const refundController = { requestRefund, chefReviewRefund, adminReviewRefund, getRefunds };
