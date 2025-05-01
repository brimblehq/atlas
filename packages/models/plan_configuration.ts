import mongoose, { Schema, Document, model } from "mongoose";
import { SUBSCRIPTION_PLAN_TYPE } from "./enum";
import { IPlanConfiguration } from "./types/plan_configuration";

const PlanConfigurationSchema = new Schema<IPlanConfiguration>(
  {
    tag: { type: String, required: true },
    slack_support: { type: Boolean, default: false },
    concurrent_builds: { type: Number, required: true },
    project_limit: { type: Number, required: true },
    deploy_private_organization: { type: Boolean, default: false },
    preview_comments: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    build_minutes: { type: Number, required: true },
    log_retention: { type: Number, required: true },
    bandwidth: { type: Number, required: true },
    price: { type: Number, required: true },
    plan_type: {
      type: String,
      enum: Object.values(SUBSCRIPTION_PLAN_TYPE),
      required: true,
    },
    memory: { type: Number, required: true },
    build_timeout: { type: Number, required: true },
    storage: { type: Number, required: true },
    cpu: { type: Number, required: true },
    tokens: { type: Number, required: false },
    token_request: { type: Number, required: false },
  },
  { timestamps: true },
);

export default model<IPlanConfiguration>(
  "PlanConfigurations",
  PlanConfigurationSchema,
  "plan_configurations",
);
