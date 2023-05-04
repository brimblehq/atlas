import { model, Schema } from "mongoose";
import {CARD_TYPES} from "./enum";
import {ICard} from "./types";

const cardSchema = new Schema(
    {
        user_id: {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
        last4: {
            type: String,
            required: true,
        },
        card_type: {
            type: String,
            enum: Object.keys(CARD_TYPES),
            required: true,
        },
        exp_month: {
            type: String,
            required: true,
        },
        exp_year: {
            type: String,
            required: true,
        },
        signature: {
            type: String,
            required: false,
        },
        authorization_code: {
            type: String,
            required: true,
        },
        preferred: {
            type:  Boolean,
            default: true,
            required: false,
        },
    },
    { timestamps: true, collection: "cards" },
);

export default model<ICard>("Card", cardSchema);
