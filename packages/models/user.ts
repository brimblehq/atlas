import { model, Schema } from "mongoose";

import { IUser } from "./types/user";

const userSchema: Schema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email_verified_at: Date,
    verification_token: {
      type: Number,
      select: false,
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
