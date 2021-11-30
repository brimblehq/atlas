import { model, Schema } from "mongoose";
import { GIT_TYPE } from "./enum";

import { IProject } from "./types";

const projectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: GIT_TYPE,
      required: true,
    },
    private: {
      type: Boolean,
      required: true,
    },
    live: {
      type: Boolean,
      default: true,
    },
    stars: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model<IProject>("Project", projectSchema);
