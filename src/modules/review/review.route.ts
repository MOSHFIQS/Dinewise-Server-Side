import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

// Public routes
router.get("/menu/:menuItemId", reviewController.getMenuItemReviews);

// Protected routes
router.post("/:menuItemId", auth("CUSTOMER"), reviewController.createReview);
router.get("/me", auth("CUSTOMER"), reviewController.getMyReviews);
router.patch("/:id", auth("CUSTOMER"), reviewController.updateReview);
router.get("/can-review/:menuItemId", auth("CUSTOMER"), reviewController.canReview);
router.delete("/:id", auth("CUSTOMER", "ADMIN"), reviewController.deleteReview);

// Admin / Chef routes
router.get("/all", auth("ADMIN"), reviewController.getAllReviews);
router.get("/chef", auth("CHEF"), reviewController.getChefReviews);

export const reviewRouter = router;
