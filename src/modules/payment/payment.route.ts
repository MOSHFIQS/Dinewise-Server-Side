import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create-intent/:orderId", auth(Role.CUSTOMER), paymentController.createPaymentIntent);
router.post("/webhook", paymentController.handleWebhook);
router.get("/all", auth(Role.ADMIN), paymentController.getAllPayments);

export const paymentRouter = router;
