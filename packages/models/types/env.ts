import { Document } from "mongoose";
import { IProject } from "./project";
import { IUser } from "./user";

export interface IEnv extends Document {
  name: string;
  value: string;
  project: IProject;
  user: IUser;
}
