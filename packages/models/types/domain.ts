import { Document } from "mongoose";
import { IProject } from "./";

export interface IDomain extends Document {
  name: string;
  project: IProject;
  user_id: string;
  primary: boolean;
  ssl?: {
    enabled: boolean;
    cert: string;
    key: string;
    expiry: Date;
  }
}
