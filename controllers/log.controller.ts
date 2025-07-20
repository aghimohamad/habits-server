import { NextFunction, Request, Response } from "express";
import HabitLog, { IHabitLog } from "../models/log.model.ts";
import Habit, { IHabit } from "../models/habit.model.ts";

/**
 * Sync multiple habit logs (batch insert)
 * Expects: req.body.logs = [{ habitId, timestamp, userId (optional if using auth middleware) }]
 */
export const syncHabitLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs: Partial<IHabitLog>[] = req.body;
    const results: Record<string, string> = {};
    const userId = req.userId;

    for (const log of logs) {
      if (!log._id) {
        // Create new log
        const newLog = (await HabitLog.create({
          ...log,
          userId: userId,
        })) as IHabitLog & { _id: any };
        if (log?.tempId) {
          results[log.tempId] = newLog._id.toString();
        }
      } else if (log.deleted) {
        // Delete log
        await HabitLog.findByIdAndDelete(log._id);
      } 
    }

    const allLogs = await HabitLog.find({ userId: userId });

    res.status(200).json({
      payload: {
        tempIds: results,
        allLogs: allLogs,
      },
      message: "Logs synced successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await HabitLog.find({ userId: req.userId });
    res.status(200).json({
      payload: logs,
      message: "Logs fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};
