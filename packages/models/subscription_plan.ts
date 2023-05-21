import { model, Schema } from "mongoose";
import {SUBSCRIPTION_STATUS} from "./enum";
import {ISubscriptionPlan} from "./types";

const subscriptionPlanSchema: Schema = new Schema({
        team_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Team",
        },
        admin_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        plan_code: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: Object.values(SUBSCRIPTION_STATUS),
            default: SUBSCRIPTION_STATUS.ACTIVE
        },
        specifications: {
            type: Object,
            default: {},
            select: true
        },
        amount: Number,
        debit_date: String,
        start_date: String,
        reminder_date: String,
        transaction_retries: Number,
    },
    {
        timestamps: true,
        collection: "subscription_plans"
    },
);

export default model<ISubscriptionPlan>("SubscriptionPlan", subscriptionPlanSchema);
