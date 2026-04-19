import { Router } from "express";
import { couponController } from "./coupon.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN), couponController.createCoupon);
router.get("/", auth(Role.ADMIN), couponController.getAllCoupons);
router.post("/validate", auth(Role.CUSTOMER), couponController.validateCoupon);
router.delete("/:id", auth(Role.ADMIN), couponController.deleteCoupon);

export const couponRouter = router;
