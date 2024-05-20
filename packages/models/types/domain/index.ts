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
  auto_renewal: boolean;
  is_discounted: boolean;
  purchased: boolean;
  privacy_enabled: boolean;
  renewal_date: string;
  renewal_price: number;
  job_identifier: string;
  trigger_created: boolean;
  trigger_created_at: string;
  nameservers: string[];
  dns: IDns[];
  is_pending_verification: boolean;
}
