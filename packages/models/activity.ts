import { model, Schema } from "mongoose";
import { ACTIVITY_TYPE } from "./enum";
import { IActivity } from "./types";

const activitySchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPE),
      required: true,
    },
    authUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default model<IActivity>("Activity", activitySchema);
