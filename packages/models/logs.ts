import { model, Schema } from "mongoose";
import { PROJECT_STATUS } from "./enum";
import { ILog } from "./types";

const LogSchema = new Schema(
  {
    logFile: String,
    commit: Object,
    name: String,
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
    startTime: Schema.Types.Date,
    endTime: Schema.Types.Date,
  },
  { timestamps: true },
);

const Log = model<ILog>("Log", LogSchema);

Log.ensureIndexes({ _id: 1, project: 1 });

export default Log;
