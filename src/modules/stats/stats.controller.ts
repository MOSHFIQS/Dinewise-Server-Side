import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { statsService } from "./stats.service";

const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await statsService.getAdminStats();
          sendResponse(res, {
               statusCode: httpStatus.OK,
               success: true,
               message: "Admin statistics fetched successfully",
               data: result,
          });
     } catch (e) {
          next(e);
     }
};

const getChefStats = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = req.user;
          const result = await statsService.getChefStats(user?.id as string);
          sendResponse(res, {
               statusCode: httpStatus.OK,
               success: true,
               message: "Chef statistics fetched successfully",
               data: result,
          });
     } catch (e) {
          next(e);
     }
};

const getCustomerStats = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const user = req.user;
          const result = await statsService.getCustomerStats(user?.id as string);
          sendResponse(res, {
               statusCode: httpStatus.OK,
               success: true,
               message: "Customer statistics fetched successfully",
               data: result,
          });
     } catch (e) {
          next(e);
     }
};

export const statsController = {
     getAdminStats,
     getChefStats,
     getCustomerStats
};
