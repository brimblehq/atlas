import { model, Schema } from "mongoose";

import { IUser } from "./types";

const userSchema: Schema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false,
    },
    email_verified_at: Date,
    verification_token: {
      type: Number,
      select: false,
    },
    github: Object,
    gitlab: Object,
    bitbucket: Object,
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
