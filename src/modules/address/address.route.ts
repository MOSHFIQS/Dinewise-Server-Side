import { Router } from "express";
import { addressController } from "./address.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), addressController.createAddress);
router.get("/", auth(Role.CUSTOMER), addressController.getAddresses);
router.put("/:id", auth(Role.CUSTOMER), addressController.updateAddress);
router.delete("/:id", auth(Role.CUSTOMER), addressController.deleteAddress);

export const addressRouter = router;
