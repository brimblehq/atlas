import { model, Schema } from "mongoose";
import { IToken } from "./types";

const tokenSchema = new Schema(
  {
    subscription_id: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    owner_id: {
      type: String,
      required: true,
      unique: true,
    },
    key: {
      type: String,
      required: false,
      unique: true,
    },
    tokens_remaining: {
      type: Number,
      required: true,
    },
    tokens_used: {
      type: Number,
      required: true,
      default: 0
    },
  },
  { timestamps: true },
);

export default model<IToken>("Token", tokenSchema, "tokens");
