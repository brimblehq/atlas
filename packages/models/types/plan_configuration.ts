import { Document } from "mongoose";
import { SUBSCRIPTION_PLAN_TYPE } from "../enum";

export interface IPlanConfiguration extends Document {
  tag: string;
  price: number;
  slack_support: boolean;
  concurrent_builds: number;
  project_limit: number;
  deploy_private_organization: boolean;
  preview_comments: boolean;
  analytics: boolean;
  build_minutes: number;
  log_retention: number;
  bandwidth: number;
  plan_type: SUBSCRIPTION_PLAN_TYPE;
  memory: number;
  build_timeout: number;
  storage: number;
  cpu: number;
}
