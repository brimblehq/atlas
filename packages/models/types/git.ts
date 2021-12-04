import { Document } from "mongoose";

export interface IGit extends Document {
  git_id?: number;
  installation_id?: number;
  access_token?: string;
  token_type?: string;
  scope?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  scopes?: string;
}
