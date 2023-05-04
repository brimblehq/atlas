import { Document } from "mongoose";
import {IMember, IProject, ISubscriptionPlan} from "./";

export interface ITeam extends Document {
  name: string;
  description: string;
  members: IMember[];
  projects: IProject[];
  image: string;
  isCreator: boolean;
  subscription: ISubscriptionPlan;
}
