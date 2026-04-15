     import { Request, Response, NextFunction } from "express";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { couponService } from "./coupon.service";

const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await couponService.createCoupon(req.body);
          sendResponse(res, { statusCode: status.CREATED, success: true, message: "Coupon created", data: result });
     } catch (e) {
          next(e);
     }
};

const getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await couponService.getAllCoupons(req.query as any);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Coupons fetched", data: result });
     } catch (e) {
          next(e);
     }
};

const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { code, cartTotal } = req.body;
          const result = await couponService.applyCoupon(code, Number(cartTotal));
          sendResponse(res, { statusCode: status.OK, success: true, message: "Coupon is valid", data: result });
     } catch (e) {
          next(e);
     }
};

const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
     try {
          await couponService.deleteCoupon(req.params.id);
          sendResponse(res, { statusCode: status.OK, success: true, message: "Coupon deleted", data: null });
     } catch (e) {
          next(e);
     }
};

export const couponController = { createCoupon, getAllCoupons, validateCoupon, deleteCoupon };
