import { Document } from "mongoose";
import { IProject } from "./";

export interface IDomain extends Document {
  name: string;
  project: IProject;
  user_id: string;
}
