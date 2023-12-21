import { Document } from "mongoose";
import { IPreview, IProject } from "../";
import { IDns } from "./dns";

export interface IDomain extends Document {
  name: string;
  project: IProject;
  user_id: string;
  team_id: string;
  primary: boolean;
  preview: IPreview;
  is_discounted: boolean;
  purchased: boolean;
  privacy_enabled: boolean;
  renewal_date: string;
  renewal_price: number;
  nameservers: string[];
  dns: IDns[];
}
