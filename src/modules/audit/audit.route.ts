import { Router } from "express";
import { auditController } from "./audit.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", auth(Role.ADMIN), auditController.getAuditLogs);

export const auditRouter = router;
