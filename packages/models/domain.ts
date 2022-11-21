import { model, Schema } from "mongoose";
import { IDomain } from "./types";

const domainSchema = new Schema(
  {
    project: {
      ref: "Project",
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default model<IDomain>("Domain", domainSchema);
