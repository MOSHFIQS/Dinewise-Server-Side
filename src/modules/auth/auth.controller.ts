import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await authService.signUpUser(req.body);

          sendResponse(res, {
               statusCode: status.CREATED,
               success: true,
               message: "User registered successfully",
               data: result,
          });
     } catch (err) {
          next(err);
     }
};

const signInUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await authService.signInUser(req.body);

          sendResponse(res, {
               statusCode: status.OK,
               success: true,
               message: "Login successful",
               data: result,
          });
     } catch (err) {
          next(err);
     }
};

export const authController = { signUpUser, signInUser };
