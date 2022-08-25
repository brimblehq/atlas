import { Document } from "mongoose";
import { INTEGRATION_TYPE } from "../enum";

export interface IIntegration extends Document {
  user_id: string;

  app_id?: string;

  name: INTEGRATION_TYPE;

  hook?: string;

  reference?: string;

  token?: string;
}
