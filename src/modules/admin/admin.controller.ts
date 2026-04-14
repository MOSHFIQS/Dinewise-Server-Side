import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import { IQueryParams } from "../../interfaces/query.interface";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await adminService.getAllUsers(req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Users fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { status: userStatus } = req.body;
          const result = await adminService.updateUserStatus(req.params.id, userStatus);
          sendResponse(res, { statusCode: status.OK, success: true, message: "User status updated", data: result });
     } catch (e) {
          next(e);
     }
};

const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await adminService.getDashboardStats();
          sendResponse(res, { statusCode: status.OK, success: true, message: "Stats fetched", data: result });
     } catch (e) {
          next(e);
     }
};

export const adminController = { getAllUsers, updateUserStatus, getDashboardStats };
