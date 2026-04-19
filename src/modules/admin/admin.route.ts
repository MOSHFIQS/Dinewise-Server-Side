import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id/status", auth(Role.ADMIN), adminController.updateUserStatus);
router.patch("/users/:id/role", auth(Role.ADMIN), adminController.updateUserRole);
router.get("/stats", auth(Role.ADMIN), adminController.getDashboardStats);

export const adminRouter = router;
