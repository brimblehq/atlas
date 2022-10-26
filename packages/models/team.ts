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
    invitations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Invitation",
      },
    ],
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ITeam>("Team", teamSchema);
