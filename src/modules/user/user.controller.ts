import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await userService.getProfile(req.user!.id);

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Profile fetched successfully",
               data: result,
          });
     } catch (err) {
          next(err);
     }
};

const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await userService.updateProfile(req.user!.id, req.body);

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Profile updated successfully",
               data: result,
          });
     } catch (err) {
          next(err);
     }
};

export const userController = { getMyProfile, updateMyProfile };
