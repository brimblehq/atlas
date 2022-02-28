import { Document } from "mongoose";

export interface IFollowing extends Document {
    user_id?: string;
    followed_id?: string;
}
