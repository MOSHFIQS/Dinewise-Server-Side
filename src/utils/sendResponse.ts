import { Response } from "express";

type SendResponseType<T> = {
     statusCode: number;
     success: boolean;
     message?: string;
     data?: T;
};

const sendResponse = <T>(res: Response, payload: SendResponseType<T>) => {
     const { statusCode, success, message, data } = payload;

     return res.status(statusCode).json({
          success,
          message,
          data,
     });
};

export default sendResponse;
