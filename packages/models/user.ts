import { model, Schema } from "mongoose";

import { IUser } from "./types";

const userSchema: Schema = new Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    email: { type: String, required: true },
    password: { type: String, select: false },
    email_verified_at: Date,
    following: [{ type: Schema.Types.ObjectId, ref: "Following" }],
    verification_token: { ype: Number, select: false },
    location: { type: String },
    interests: { type: Array },
    github: Object,
    gitlab: Object,
    bitbucket: Object,
    access_code: { type: Number, select: false },
    company: String,
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    avatar: { type: String },
    freeTrialActive: {
      type: Boolean,
      default: true,
      required: false,
    },
    tenant_id: { type: Schema.Types.ObjectId, ref: "Tenancy", required: false }
  },
  { timestamps: true },
);

export default model<IUser>("User", userSchema);
