import { model, Schema } from "mongoose";
import { IDbImage } from "./types";
import { DatabaseEngine } from "./enum";

const dbImageSchema = new Schema(
  {
    name: {
      type: String,
      enum: Object.values(DatabaseEngine),
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    envs: {
      type: Array,
      required: true,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
    has_port: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default model<IDbImage>("DbImage", dbImageSchema);
