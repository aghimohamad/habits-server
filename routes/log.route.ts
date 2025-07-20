// the route is /api/v1/logs

import express from "express";
const router = express.Router();
import { syncHabitLogs, getLogs } from "../controllers/log.controller.ts";
import authorize from "../middleware/auth.middleware.ts";

router.post("/sync", authorize, syncHabitLogs);
router.get("/", authorize, getLogs);

export default router;