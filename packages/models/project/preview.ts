import { Schema, model } from "mongoose";
import { IPreview } from "../types";
import { PROJECT_STATUS } from "../enum";

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
    healthCheckPath: {
      type: String,
      required: false,
    },
    pid: Number,
    port: Number,
    ip: String,
    dir: String,
    branch: String,
    issue_comment_id: Number,
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.PENDING,
    },
    log: {
      ref: "Log",
      type: Schema.Types.ObjectId,
    },
    last_requested: Schema.Types.Date,
    isPaused: Boolean,
  },
  { timestamps: true },
);

export default model<IPreview>("Preview", previewsSchema);
