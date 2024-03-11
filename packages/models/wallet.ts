import { model, Schema } from "mongoose";
import { IWallet } from "./types/wallet";

const walletSchema: Schema = new Schema(
  {
    balance: {
      type: Number,
      required: true
    }
  }
);

export default model<IWallet>("Wallet", walletSchema);
