import { model, Schema } from "mongoose";
import { ITenancy } from "./types";

const tenancySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      ref: "Team",
      type: Schema.Types.ObjectId,
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: "Server",
      required: true,
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    is_activated: Boolean,
  },
  { timestamps: true },
);

export default model<ITenancy>("Tenancy", tenancySchema);