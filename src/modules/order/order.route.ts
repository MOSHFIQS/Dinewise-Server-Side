import { Router } from "express";
import { orderController } from "./order.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), orderController.placeOrder);
router.get("/my-orders", auth(Role.CUSTOMER), orderController.getCustomerOrders);
router.get("/all", auth(Role.ADMIN, Role.CHEF), orderController.getAllOrders);
router.get("/:id", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), orderController.getOrderById);
router.patch("/:id/status", auth(Role.CHEF, Role.ADMIN), orderController.updateOrderStatus);

export const orderRouter = router;
