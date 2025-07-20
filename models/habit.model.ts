import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  name: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  startDate: string;
  times: string[];
  color: string;
  reminderEnabled: boolean;
  goal: number;
  streak: number;
  bestStreak: number;
  lastCompleted?: string;
  deleted?: boolean; // ✅ Soft delete flag
  tempId?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const habitSchema = new Schema<IHabit>(
  {
    tempId: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Habit Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      enum: ['daily', 'weekdays', 'weekends', 'weekly'],
      default: 'daily',
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    times: [
      {
        type: String,
        required: [true, 'At least one time is required'],
        validate: {
          validator: function (v: string) {
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
          },
          message: 'Time must be in HH:mm format',
        },
      },
    ],
    color: {
      type: String,
      required: [true, 'Color is required'],
      default: '#3B82F6',
    },
    reminderEnabled: {
      type: Boolean,
      default: true,
    },
    goal: {
      type: Number,
      required: [true, 'Goal is required'],
      min: 1,
      default: 1,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastCompleted: {
      type: String,
      required: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Habit = mongoose.model<IHabit>('Habit', habitSchema);

// Mock habit data for testing
  export const mockHabitJson = {
    "name": "Morning Exercise",
    "category": "Fitness",
    "frequency": "daily",
    "startDate": "2024-01-01",
    "times": ["07:00", "08:00"],
    "color": "#10B981",
    "reminderEnabled": true,
    "goal": 1,
    "streak": 5,
    "bestStreak": 10,
    "lastCompleted": "2024-01-15",
    "deleted": false,
    "tempId": "temp_123456"
  };

export default Habit;