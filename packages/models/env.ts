import { model, Schema } from "mongoose";
import { ENVIRONMENT } from "./enum";
import { IEnv } from "./types";

const envSchema = new Schema(
  {
    project: {
      ref: "Project",
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    environment: {
      type: String,
      enum: Object.values(ENVIRONMENT),
      required: true,
    },
  },
  { timestamps: true },
);

export default model<IEnv>("Env", envSchema);
