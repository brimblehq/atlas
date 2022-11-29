import { Document } from "mongoose";

export interface IInstalledIntegration extends Document {
  user_id: string;

  integration_id: string;

  enabled: boolean;
}
