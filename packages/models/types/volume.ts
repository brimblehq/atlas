import { Document } from "mongoose";
import { IUser } from "./user";
import { ITeam } from "./team";
import { ISubscription } from "./subscription";
import { IRegion } from "./region";

export interface IVolume extends Document {
  name: string;
  user?: IUser;
  team?: ITeam;
  subscription: ISubscription;
  region: IRegion;
  size: number;
  mount_path?: string;
  created_at?: Date;
  updated_at?: Date;
}
