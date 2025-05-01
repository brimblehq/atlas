import { Document } from "mongoose";
import { ISubscription } from "./subscription";

export interface IToken extends Document {
  subscription_id: ISubscription;
  owner_id: string;
  tokens_remaining: string;
  tokens_used: string;
}
