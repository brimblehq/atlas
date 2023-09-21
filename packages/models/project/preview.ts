import { Schema, model } from "mongoose";
import { IPreview } from "../types";

const previewsSchema = new Schema(
  {
    name: String,
    project: {
      ref: "Project",
      type: Schema.Types.ObjectId,
    },
    server: {
      ref: "Server",
      type: Schema.Types.ObjectId,
    },
    pid: Number,
    port: Number,
    ip: String,
    dir: String,
    branch: String,
    vmName: String,
  },
  { timestamps: true },
);

export default model<IPreview>("Preview", previewsSchema);
