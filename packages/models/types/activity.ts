import { Document } from "mongoose";
import { ACTIVITY_TYPE } from "../enum";
import { IProject } from "./project";
import { IUser } from "./user";

export interface IActivity extends Document {
  type: ACTIVITY_TYPE;
  project: IProject;
  user: IUser;
  authUser: IUser;
}
