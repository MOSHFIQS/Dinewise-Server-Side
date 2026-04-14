import { Router } from "express";
import { notificationController } from "./notification.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/me", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), notificationController.getMyNotifications);
router.patch("/:id/read", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), notificationController.markAsRead);

export const notificationRouter = router;
