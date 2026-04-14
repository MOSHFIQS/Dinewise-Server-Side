import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { orderService } from "./order.service";
import { OrderStatus } from "../../../generated/prisma/enums";

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.placeOrder((req as any).user.id, req.body);
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Order placed", data: result });
     } catch (e) {
          next(e);
     }
};

const getCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.getCustomerOrders((req as any).user.id, req.query);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Orders fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.getOrderById(req.params.id);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Order fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { action } = req.body;
          const statusMap: Record<string, OrderStatus> = {
               confirm: OrderStatus.CONFIRMED,
               process: OrderStatus.PROCESSING,
               ship: OrderStatus.SHIPPED,
               deliver: OrderStatus.DELIVERED,
               cancel: OrderStatus.CANCELLED,
          };
          const newStatus = statusMap[action];
          if (!newStatus) throw new Error("Invalid status action");

          const result = await orderService.updateOrderStatus(req.params.id, newStatus);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Order updated", data: result });
     } catch (e) {
          next(e);
     }
};

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await orderService.getAllOrders(req.query);
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
