// i need to create 2 endpoints for the habit controller
// the first one should be sync , where i send a patch of habbits and save them to db , the logic is the following , looping on the patch , if the habbit doesn't have  an id , then i need to create it , if it has an id , then i need to update it only if the updatedAt is greater than the updatedAt in the db , an if the habbit has a property deleted , then i need to delete it after that return an array that contain tempIds and the ids of the habbits that were created

import Habit from "../models/habit.model.ts";
import { Response, NextFunction, Request } from "express";
import { IHabit } from "../models/habit.model.ts";
import mongoose from "mongoose";
export const syncHabits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const habits: IHabit[] = req.body;
    console.log(req.userId);
    const results: Record<string, string> = {};

    for (const habit of habits) {
      if (!habit._id) {
        // Create new habit
        const newHabit = (await Habit.create({
          ...habit,
          userId: req.userId,
        })) as IHabit & {
          _id: mongoose.Types.ObjectId;
        };
        results[habit?.tempId!] = newHabit._id.toString();
      } else if (habit.deleted) {
        // Delete habit
        await Habit.findByIdAndDelete(habit._id);
      } else {
        // Update habit if newer
        const existingHabit = await Habit.findById(habit._id);
        if (
          existingHabit &&
          new Date(habit.updatedAt).getTime() >
            new Date(existingHabit.updatedAt).getTime()
        ) {
          await Habit.findByIdAndUpdate(habit._id, habit, { new: true });
        }
      }
    }

    const allHabits = await Habit.find({ userId: req.userId });

    res.status(200).json({
      payload: {
        tempIds: results,
        allHabits: allHabits,
      },
      message: "Habits synced successfully",
    });
  } catch (err) {
    next(err);
  }
};

// get
export const getHabits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    res.status(200).json({
      payload: habits,
      message: "Habits fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};
 