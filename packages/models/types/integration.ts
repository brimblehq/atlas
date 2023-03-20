import { Document } from "mongoose";
import { INTEGRATION_PROVIDERS, INTEGRATION_TYPES } from "../enum";

export interface IIntegration extends Document {
  user_id: string | null;

  app_id?: string;

  name: INTEGRATION_PROVIDERS;

  scope_description?: string;

  hook?: string;

  reference?: string;

  token?: string;

  type: INTEGRATION_TYPES;

  extra?: any;
}
