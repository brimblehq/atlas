import { Document } from "mongoose";
import { SUBSCRIPTION_PLAN_TYPE, SUBSCRIPTION_STATUS } from "../enum";
import { IUser } from "./user";
import { ITeam } from "./team";

export interface ISubscription extends Document {
  team_id: ITeam;
  admin_id: IUser;
  billable_id: IUser;
  plan_type: SUBSCRIPTION_PLAN_TYPE;
  status: SUBSCRIPTION_STATUS;
  amount: number;
  transaction_retries: number;
  debit_date: string;
  start_date: string;
  expiry_date: string;
  reminder_date: string;
  job_identifier: string;
  trigger_created: boolean;
  trigger_created_at: string;
  specifications: {
    [key: string]: any;
  };
}