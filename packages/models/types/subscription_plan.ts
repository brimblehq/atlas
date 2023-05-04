import { Document } from "mongoose";
import {SUBSCRIPTION_STATUS} from "../enum";
export interface ISubscriptionPlan extends Document {
    team_id: string;
    admin_id: string;
    plan_code: string;
    status: SUBSCRIPTION_STATUS;
    amount: number;
    debit_date: string;
    start_date: string;
    reminder_date: string;
    specifications: {
        [key: string]: any;
    }
}
