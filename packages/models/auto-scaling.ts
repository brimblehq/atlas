import { model, Schema } from "mongoose";
import { IAutoScalingGroup } from "./types";

const autoScalingGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: false,
    },
    subscription_id: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    min_containers: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    max_containers: {
      type: Number,
      required: true,
      default: 10,
    },
    max_memory: {
      type: Number,
      required: false,
    },
    max_cpu: {
      type: Number,
      required: false,
    },
    min_application_response_time: {
      type: Number,
      required: true,
      default: 5,
    },
    active: {
      type: Boolean,
      default: true,
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "autoscaling_groups",
  },
);

autoScalingGroupSchema.index({ user_id: 1 });
autoScalingGroupSchema.index({ team_id: 1 });
autoScalingGroupSchema.index({ subscription_id: 1 });

export default model<IAutoScalingGroup>(
  "AutoScalingGroup",
  autoScalingGroupSchema,
  "auto_scaling_groups",
);
