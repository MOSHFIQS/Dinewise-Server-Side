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

const getMyReviews = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = (req as any).user;
          const result = await reviewService.getMyReviews(user.id, req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "My reviews fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await reviewService.getAllReviews(req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "All reviews fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const getChefReviews = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = (req as any).user;
          const result = await reviewService.getChefReviews(user.id, req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Chef reviews fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = (req as any).user;
          const result = await reviewService.updateReview(req.params.id as string, user.id, req.body);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Review updated", data: result });
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

const canReview = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = (req as any).user;
          const { menuItemId } = req.params;
          const result = await reviewService.canReview(user.id, menuItemId as string);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Review eligibility checked", data: result });
     } catch (e) {
          next(e);
     }
};

export const reviewController = {
     createReview,
     getMenuItemReviews,
     getMyReviews,
     getAllReviews,
     getChefReviews,
     canReview,
     updateReview,
     deleteReview,
};
