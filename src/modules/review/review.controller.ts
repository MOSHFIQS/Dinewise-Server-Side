import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import { IQueryParams } from "../../interfaces/query.interface";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { menuItemId } = req.params;
          const result = await reviewService.createReview((req as any).user.id, menuItemId as string, req.body);
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Review added", data: result });
     } catch (e) {
          next(e);
     }
};

const getMenuItemReviews = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { menuItemId } = req.params;
          const result = await reviewService.getReviewsForMenu(menuItemId as string, req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Reviews fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = (req as any).user;
          await reviewService.deleteReview(req.params.id as string, user.id, user.role);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Review deleted", data: null });
     } catch (e) {
          next(e);
     }
};

export const reviewController = { createReview, getMenuItemReviews, deleteReview };
