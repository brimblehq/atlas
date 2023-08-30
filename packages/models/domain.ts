import { model, Schema } from "mongoose";
import { IDomain } from "./types";
import { ENVIRONMENT } from "./enum";

const domainSchema = new Schema(
  {
    project: {
      ref: "Project",
      type: Schema.Types.ObjectId,
      required: false,
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
    is_free: {
      type: Boolean,
      default: false
    },
    preview: {
      ref: "Preview",
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

export default model<IDomain>("Domain", domainSchema);
