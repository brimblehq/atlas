import { Document } from "mongoose";

export interface IGit extends Document {
  git_id?: number;
  installation_ids?: number[];
  access_token: string;
  token_type: string;
  scope?: string;
  refresh_token?: string;
  created_at?: number;
  state?: string;
  expires_in?: number;
  expires_at?: number;
  scopes?: string;
}
