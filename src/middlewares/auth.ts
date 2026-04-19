import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import status from "http-status";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";

declare global {
     namespace Express {
          interface Request {
               user?: {
                    id: string;
                    email: string;
                    role: string;
                    status: string;
                    name: string;
               };
          }
     }
}

export const auth = (...allowedRoles: Role[]) => {
     return (req: Request, res: Response, next: NextFunction) => {
          const token = req.cookies.token;

          if (!token) {
               return res.status(status.UNAUTHORIZED).json({
                    success: false,
                    message: "Not logged in",
               });
          }

          try {
               const decoded = jwt.verify(token, envVars.JWT_SECRET!) as {
                    id: string;
                    role: Role;
                    email: string;
                    status: string;
                    name: string;
               };

               if (decoded.status === UserStatus.BANNED) {
                    return res.status(status.FORBIDDEN).json({
                         success: false,
                         message: "Your account has been banned",
                    });
               }

               req.user = decoded;

               if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                    return res.status(status.FORBIDDEN).json({
                         success: false,
                         message: "You are not authorized",
                    });
               }

               next();
          } catch {
               return res.status(status.UNAUTHORIZED).json({
                    success: false,
                    message: "Invalid token",
               });
          }
     };
};
