import { model, Schema } from "mongoose";
import { IInvitation } from "./types";

const invitationSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IInvitation>("Invitation", invitationSchema);
