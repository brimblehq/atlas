import { Document } from "mongoose";

export interface IOauthUser extends Document {
  email?: string;
  username: string;
  token: JSON;
  company?: string;
  oauth_provider: string;
}
