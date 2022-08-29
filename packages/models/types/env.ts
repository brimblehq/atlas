import { Document } from "mongoose";
import { IProject } from "./project";

export interface IEnv extends Document {
  name: string;
  value: string;
  project: IProject;
}
