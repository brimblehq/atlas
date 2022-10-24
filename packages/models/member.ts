import { model, Schema } from "mongoose";
import { ROLES } from "./enum";
import { IMember } from "./types";

const memberSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IMember>("Member", memberSchema);
