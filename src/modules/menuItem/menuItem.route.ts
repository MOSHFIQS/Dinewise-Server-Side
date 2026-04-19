import { Router } from "express";
import { menuItemController } from "./menuItem.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/chef", auth(Role.CHEF), menuItemController.createMenuItem);
router.put("/chef/:id", auth(Role.CHEF), menuItemController.updateMenuItem);
router.delete("/chef/:id", auth(Role.CHEF), menuItemController.deleteMenuItem);
router.get("/chef", auth(Role.CHEF), menuItemController.getChefMenuItems);

router.get("/", menuItemController.getAllMenuItems);
router.get("/:id", menuItemController.getMenuItemById);

export const menuItemRouter = router;
