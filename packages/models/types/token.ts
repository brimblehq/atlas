import { Document } from "mongoose";
import { OAUTH_PERMISSIONS } from "../enum";

export interface IToken extends Document {
  name: string;

  apiKey: string | null;

  description: string[];

  image: string;

  installationUrl?: string;

  redirectUrl?: string | null;

  encodedToken: string;

  permission: OAUTH_PERMISSIONS[];
}
