import { Document } from "mongoose";
import { ENVIRONMENT } from "../enum";
import { IProject, IUser } from "./";

export interface IEnv extends Document {
  name: string;
  value: string;
  project: IProject;
  user: IUser;
  environment: ENVIRONMENT;
}
