import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { orderService } from "./order.service";
import { OrderStatus } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interfaces/query.interface";

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.placeOrder((req as any).user.id, req.body, {
               ipAddress: req.ip,
               userAgent: req.headers["user-agent"]
          });
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Order placed", data: result });
     } catch (e) {
          next(e);
     }
};

const getCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.getCustomerOrders((req as any).user.id, req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Orders fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.getOrderById(req.params.id as string);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Order fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { action } = req.body;
          const statusMap: Record<string, OrderStatus> = {
               placed: OrderStatus.PLACED,
               confirm: OrderStatus.CONFIRMED,
               process: OrderStatus.PROCESSING,
               ship: OrderStatus.SHIPPED,
               deliver: OrderStatus.DELIVERED,
               cancel: OrderStatus.CANCELLED,
          };
          
          let newStatus = statusMap[action];

          // If action is not in map, check if it's a valid literal status string
          if (!newStatus && Object.values(OrderStatus).includes(action as OrderStatus)) {
               newStatus = action as OrderStatus;
          }

          if (!newStatus) throw new Error("Invalid status action");

          const result = await orderService.updateOrderStatus(req.params.id as string, newStatus, {
               userId: (req as any).user?.id,
               ipAddress: req.ip,
               userAgent: req.headers["user-agent"]
          });
          sendResponse(res, { statusCode: status.OK, success: true, message: "Order updated", data: result });
     } catch (e) {
          next(e);
     }
};

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.getAllOrders(req.query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Orders fetched", data: result });
     } catch (e) {
          next(e);
     }
};

export const orderController = {
     placeOrder,
     getCustomerOrders,
     getOrderById,
     updateOrderStatus,
     getAllOrders,
};
