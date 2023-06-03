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
    storage_size: Number,
    memory: Number
  },
  { timestamps: true },
);

export default model<ITenancy>("Tenancy", tenancySchema);