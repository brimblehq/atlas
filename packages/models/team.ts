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
    build_disabled: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Subscription",
    },
  },
  {
    timestamps: true,
  },
);

export default model<ITeam>("Team", teamSchema);
