import { model, Schema } from "mongoose";
import { IDomain } from "../types";

const domainSchema = new Schema(
  {
    project: {
      ref: "Project",
      type: Schema.Types.ObjectId,
      required: false,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    team_id: {
      ref: "Team",
      type: Schema.Types.ObjectId,
      required: true
    },
    user_id: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    is_discounted: {
      type: Boolean,
      default: false,
    },
    auto_renewal: {
      type: Boolean,
      default: false,
    },
    privacy_enabled: {
      type: Boolean,
      default: false,
    },
    renewal_date: {
      type: String,
      required: false,
    },
    renewal_price: {
      type: Number,
      required: false,
    },
    preview: {
      ref: "Preview",
      type: Schema.Types.ObjectId,
    },
    subscription: {
      ref: "Subscription",
      type: Schema.Types.ObjectId,
    },
    nameservers: {
      type: Array,
      required: false,
    },
    purchased: {
      type: Boolean,
      default: false,
    },
    trigger_created: {
      type: Boolean,
      default: false,
    },
    trigger_created_at: {
      type: String,
    },
    job_identifier: {
      type: String,
    },
    dns: [
      {
        ref: "Dns",
        type: Schema.Types.ObjectId,
      },
    ],
    is_pending_verification: Boolean,
  },
  { timestamps: true },
);

export default model<IDomain>("Domain", domainSchema);
