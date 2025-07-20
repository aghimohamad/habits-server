import mongoose, { Document, Schema } from 'mongoose';

export interface IHabitLog extends Document {
  habitId: mongoose.Types.ObjectId;
  timestamp: Date;
  userId?: mongoose.Types.ObjectId | null;
  tempId?: string
  deleted: boolean
}

const habitLogSchema = new Schema<IHabitLog>(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

const HabitLog = mongoose.model<IHabitLog>('HabitLog', habitLogSchema);

export default HabitLog;