import { model, Schema } from "mongoose";

import { IOauthUser } from "./types/oauthUser";

const oauthUserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: String,
    company: String,
    oauth_provider: {
      type: String,
      required: true,
    },
    token: {
      type: JSON,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IOauthUser>("oauth_users", oauthUserSchema);
