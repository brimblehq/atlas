import { model, Schema } from "mongoose";
import { IProject } from "./types";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    uuid: {
      type: Number,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domains: [
      {
        ref: "Domain",
        type: Schema.Types.ObjectId,
      },
    ],
    environments: [
      {
        ref: "Env",
        type: Schema.Types.ObjectId,
      },
    ],
    pid: {
      type: Number,
    },
    port: {
      type: Number,
    },
    dir: {
      type: String,
    },
    buildCommand: {
      type: String,
    },
    outputDirectory: {
      type: String,
    },
    repo: Object,
  },
  { timestamps: true },
);

export default model<IProject>("Project", projectSchema);
