import { Router } from "express";
import { refundController } from "./refund.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), refundController.requestRefund);
router.get("/", auth(Role.ADMIN, Role.CHEF, Role.CUSTOMER), refundController.getRefunds);
router.patch("/:id/chef", auth(Role.CHEF), refundController.chefReviewRefund);
router.patch("/:id/admin", auth(Role.ADMIN), refundController.adminReviewRefund);

export const refundRouter = router;
