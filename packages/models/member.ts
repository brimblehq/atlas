import { model, Schema } from "mongoose";
import { ROLES } from "./enum";
import { IMember } from "./types";

const memberSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    email: String,
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    featureOnboarded: {
      type: Boolean,
      default: false,
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: "MemberPermission" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default model<IMember>("Member", memberSchema);
