import { model, Schema } from "mongoose";
import { ITeam } from "./types";

const teamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    image: {
      type: String,
    },
    subscription: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "SubscriptionPlan",
    },
    tenant: { type: Schema.Types.ObjectId, ref: "Tenancy", required: false }
  },
  {
    timestamps: true,
  },
);

export default model<ITeam>("Team", teamSchema);
