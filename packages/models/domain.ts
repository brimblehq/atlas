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
    team_id: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    ssl: {
      type: Object,
      default: {},
      select: false,
    },
  },
  { timestamps: true },
);

export default model<IDomain>("Domain", domainSchema);
