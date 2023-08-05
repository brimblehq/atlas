import { Document } from "mongoose";
import {SUBSCRIPTION_STATUS} from "../enum";

export interface ISubscription extends Document {
    team_id: string;
    admin_id: string;
    plan_code: string;
    status: SUBSCRIPTION_STATUS;
    amount: number;
    transaction_retries: number;
    debit_date: string;
    start_date: string;
    expiry_date: string;
    reminder_date: string;
    specifications: {
        [key: string]: any;
    }
}
