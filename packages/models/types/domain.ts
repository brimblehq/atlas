import { Document } from "mongoose";
import { IProject } from "./project";

export interface IDomain extends Document {
  name: string;
  project: IProject;
  user_id: string;
}
