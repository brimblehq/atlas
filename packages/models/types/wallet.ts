import { Document } from "mongoose";

export interface IWallet extends Document {
  balance: number;
}
