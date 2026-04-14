import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { auditService } from "./audit.service";
import { IQueryParams } from "../../interfaces/query.interface";

const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await auditService.getAuditLogs(req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Audit logs fetched", data: result });
     } catch (e) {
          next(e);
     }
};

export const auditController = { getAuditLogs };
