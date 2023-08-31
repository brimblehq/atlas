import { Document } from "mongoose";
import { IPreview, IProject } from "./";

export interface IDomain extends Document {
  name: string;
  project: IProject;
  user_id: string;
  team_id: string;
  primary: boolean;
  preview: IPreview;
  is_free: boolean;
  privacy_enabled: boolean;
  renewal_date: string;
  renewal_price: number;
}
