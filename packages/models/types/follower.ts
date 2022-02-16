import { Document } from "mongoose";

export interface IFollower extends Document {
    user_id?: number;
}
