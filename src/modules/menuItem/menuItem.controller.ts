import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { menuItemService } from "./menuItem.service";
import { IQueryParams } from "../../interfaces/query.interface";

const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await menuItemService.createMenuItem((req as any).user.id, req.body);
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Menu item created", data: result });
     } catch (e) {
          next(e);
     }
};

const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await menuItemService.updateMenuItem(req.params.id as string, (req as any).user.id, req.body);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Menu item updated", data: result });
     } catch (e) {
          next(e);
     }
};

const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await menuItemService.deleteMenuItem(req.params.id as string, (req as any).user.id);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Menu item deleted", data: null });
     } catch (e) {
          next(e);
     }
};

const getChefMenuItems = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await menuItemService.getChefMenuItems((req as any).user.id, query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Chef menu items fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const getAllMenuItems = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const query = req.query;
          const result = await menuItemService.getAllMenuItems(query as IQueryParams);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Menu items fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const getMenuItemById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await menuItemService.getMenuItemById(req.params.id as string);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Menu item fetched", data: result });
     } catch (e) {
          next(e);
     }
};

export const menuItemController = {
     createMenuItem,
     updateMenuItem,
     deleteMenuItem,
     getChefMenuItems,
     getAllMenuItems,
     getMenuItemById,
};
