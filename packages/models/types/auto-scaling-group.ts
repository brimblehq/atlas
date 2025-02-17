import { Types } from "mongoose";

export interface IAutoScalingGroup extends Document {
  _id: Types.ObjectId;
  name: string;
  user_id: Types.ObjectId;
  team_id?: Types.ObjectId;
  subscription_id: Types.ObjectId;
  min_containers: number;
  max_containers: number;
  min_application_response_time: number;
  active: boolean;
  meta: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
