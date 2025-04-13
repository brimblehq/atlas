import { Document } from "mongoose";
import { IUser } from "./user";
import { ITeam } from "./team";
import { ISubscription } from "./subscription";

export interface IVolume extends Document {
  name: string;
  user?: IUser;
  team?: ITeam;
  subscription: ISubscription;
  size: number;
  mount_path?: string;
  created_at?: Date;
  updated_at?: Date;
}
