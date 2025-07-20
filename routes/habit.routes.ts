// routes/habit.routes.ts
import express from "express";
const router = express.Router();
import { getHabits, syncHabits } from "../controllers/habit.controller.ts";
import authorize from "../middleware/auth.middleware.ts";

// Sync habits
router.post('/sync',authorize, syncHabits );

// Get all habits
router.get("/", authorize, getHabits);

export default router;
