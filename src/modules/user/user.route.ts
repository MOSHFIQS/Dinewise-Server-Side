import express, { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/me", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), userController.getMyProfile);
router.put("/me", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), userController.updateMyProfile);

export const userRouter: Router = router;
