import { model, Schema } from "mongoose";
import { IDbImage } from "./types";

const dbImageSchema = new Schema(
  {
    name: {
      type: String,
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
  },
  { timestamps: true },
);

export default model<IDbImage>("DbImage", dbImageSchema);
