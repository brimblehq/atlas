import { model, Schema } from "mongoose";
import { IFollowing } from "./types";

const followingSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followed_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<IFollowing>("Following", followingSchema);
