import { Document } from "mongoose";
import { SUBSCRIPTION_STATUS } from "../enum";
import { IUser } from "./user";

export interface ISubscription extends Document {
  team_id: string;
  admin_id: IUser;
  plan_type: string;
  status: SUBSCRIPTION_STATUS;
  amount: number;
  transaction_retries: number;
  debit_date: string;
  start_date: string;
  expiry_date: string;
  reminder_date: string;
  trigger_created: boolean;
  trigger_created_at: string;
  specifications: {
    [key: string]: any;
  };
}
