import { model, Schema } from "mongoose";
import { PROJECT_STATUS } from "./enum";
import { ILog } from "./types";

const LogSchema = new Schema(
  {
    name: String,
    commit: Object,
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.PENDING,
    },
    project: {
      ref: "Project",
      type: Schema.Types.ObjectId,
    },
    user: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    jobs: Array,
    startTime: Schema.Types.Date,
    endTime: Schema.Types.Date,
  },
  { timestamps: true },
);

export default model<ILog>("Log", LogSchema);
