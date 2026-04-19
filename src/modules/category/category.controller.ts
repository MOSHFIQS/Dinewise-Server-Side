import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await categoryService.createCategory(req.body);
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Category created", data: result });
     } catch (e) {
          next(e);
     }
};

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await categoryService.getAllCategories(req.query as any);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Categories fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await categoryService.getCategoryById(req.params.id as string);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Category fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await categoryService.updateCategory(req.params.id as string, req.body);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Category updated", data: result });
     } catch (e) {
          next(e);
     }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await categoryService.deleteCategory(req.params.id as string);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Category deleted", data: null });
     } catch (e) {
          next(e);
     }
};

export const categoryController = {
     createCategory,
     getAllCategories,
     getCategoryById,
     updateCategory,
     deleteCategory,
};
