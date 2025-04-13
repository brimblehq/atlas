import { model, Schema } from "mongoose";

import { IVolume } from "./types";

const volumeSchema: Schema = new Schema(
  {
    name: String,
    user: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      default: null,
    },
    team: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Team",
      default: null,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Subscription",
    },
    size: { type: Number, required: true },
    mount_path: { type: String },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default model<IVolume>("Volume", volumeSchema);
