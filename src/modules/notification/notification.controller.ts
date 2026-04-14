import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { notificationService } from "./notification.service";

const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await notificationService.getMyNotifications((req as any).user.id);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Notifications fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await notificationService.markAsRead(req.params.id, (req as any).user.id);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Notification marked as read", data: result });
     } catch (e) {
          next(e);
     }
};

export const notificationController = { getMyNotifications, markAsRead };
