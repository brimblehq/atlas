import { Document } from "mongoose";

export interface IOauthUser extends Document {
  email?: string;
  username: string;
  token: Token;
  company?: string;
  oauth_provider: string;
}

export interface Token {
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
