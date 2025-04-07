import { model, Schema } from "mongoose";
import { IComputeChange } from "./types/compute";

const ComputeChangeSchema = new Schema({
  project_id: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  team_id: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: false,
    index: true,
  },
  subscription_id: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  previous: {
    cpu: { type: Number, required: true },
    memory: { type: Number, required: true },
    storage: { type: Number, required: true },
  },
  current: {
    cpu: { type: Number, required: true },
    memory: { type: Number, required: true },
    storage: { type: Number, required: true },
  },
  costs: {
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    cpuCost: { type: Number, default: 0 },
    memoryCost: { type: Number, default: 0 },
    storageCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
  },
  billed: {
    type: Boolean,
    default: false,
  },
});

export default model<IComputeChange>(
  "ComputeChange",
  ComputeChangeSchema,
  "compute_changes",
);
