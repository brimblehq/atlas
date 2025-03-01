import { Types } from "mongoose";

export interface IAutoScalingGroup extends Document {
  _id: Types.ObjectId;
  name: string;
  replicas: number;
  user_id: Types.ObjectId;
  team_id?: Types.ObjectId;
  subscription_id: Types.ObjectId;
  min_containers: number;
  max_containers: number;
  active: boolean;
  max_cpu: number;
  max_memory: number;
  meta: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
