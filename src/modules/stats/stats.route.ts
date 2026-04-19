import express from "express";
import { statsController } from "./stats.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/admin", auth(Role.ADMIN), statsController.getAdminStats);
router.get("/chef", auth(Role.CHEF), statsController.getChefStats);
router.get("/customer", auth(Role.CUSTOMER), statsController.getCustomerStats);

export const StatsRoutes = router;
