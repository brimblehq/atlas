import { Document } from "mongoose";
import { IPreview, IProject } from "./";

export interface IDomain extends Document {
  name: string;
  project: IProject;
  user_id: string;
  team_id: string;
  primary: boolean;
  preview: IPreview;
  isPurchased: boolean;
  isFree: boolean;
}
