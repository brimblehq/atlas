import { model, Schema } from "mongoose";
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
  },
  { timestamps: true },
);

export default model<IEnv>("Env", envSchema);
