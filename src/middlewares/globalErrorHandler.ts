import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
     const statusCode = err.statusCode || 500;

     res.status(statusCode).json({
          success: false,
          message: err.message || "Internal Server Error",
          stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
     });
}

export default errorHandler;
