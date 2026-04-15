import { Response } from "express";

type SendResponseType<T> = {
     statusCode: number;
     success: boolean;
     message?: string;
     meta?: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
     };
     data?: T;
};

const sendResponse = <T>(res: Response, payload: SendResponseType<T>) => {
     const { statusCode, success, message, meta, data } = payload;

     return res.status(statusCode).json({
          success,
          message,
          meta: meta || (data as any)?.meta || null,
          data: (data as any)?.data || data || null,
     });
};

export default sendResponse;
