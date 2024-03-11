import { model, Schema } from "mongoose";

import { IUser } from "./types";

const userSchema: Schema = new Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    email: { type: String, required: true },
    password: { type: String },
    email_verified_at: Date,
    following: [{ type: Schema.Types.ObjectId, ref: "Following" }],
    verification_token: { ype: Number },
    location: { type: String },
    interests: { type: Array },
    github: Object,
    gitlab: Object,
    bitbucket: Object,
    access_code: { type: Number },
    company: String,
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    avatar: { type: String },
    freeTrialActive: {
      type: Boolean,
      default: true,
      required: false,
    },
    activated: {
      type: Boolean,
      default: false,
      required: false,
    },
    tenant: { type: Schema.Types.ObjectId, ref: "Tenancy", required: false },
    is_waitlist: { type: Boolean, default: true },
    notifications: Object,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default model<IUser>("User", userSchema);
