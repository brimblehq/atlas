import { Document } from "mongoose";

export interface IInstalledIntegration extends Document {
  user_id: string | null;

  integration_id: string | null;

  enabled: boolean;
}
