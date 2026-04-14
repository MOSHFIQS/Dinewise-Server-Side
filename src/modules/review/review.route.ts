import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/:menuItemId", auth(Role.CUSTOMER), reviewController.createReview);
router.get("/:menuItemId", reviewController.getMenuItemReviews);
router.delete("/:id", auth(Role.CUSTOMER, Role.ADMIN), reviewController.deleteReview);

export const reviewRouter = router;
