import { model, Schema } from "mongoose";
import {SUBSCRIPTION_PLAN_TYPE, SUBSCRIPTION_STATUS} from "./enum";
import { ISubscription } from "./types";

const subscriptionSchema: Schema = new Schema(
  {
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    admin_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    billable_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    project_id: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Project",
      default: null,
    },
    plan_type: {
      type: String,
      enum: Object.values(SUBSCRIPTION_PLAN_TYPE),
      default: SUBSCRIPTION_PLAN_TYPE.FreePlan,
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.ACTIVE,
    },
    grafana_org_id: String,
    specifications: {
      type: Object,
      default: {},
      select: true,
    },
    amount: Number,
    debit_date: String,
    start_date: String,
    expiry_date: String,
    reminder_date: String,
    transaction_retries: Number,
    trigger_created: {
      type: Boolean,
      default: false
    },
    trigger_created_at: {
      type: String
    },
    job_identifier: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: "subscriptions",
  },
);

export default model<ISubscription>("Subscription", subscriptionSchema);
