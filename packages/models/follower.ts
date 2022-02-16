import { model, Schema } from "mongoose";
import { GIT_TYPE } from "./enum";
import { IFollower } from "./types";

const followerSchema: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true }
);

export default model<IFollower>("Follower", followerSchema);