import { model, Schema } from "mongoose";
import { IToken } from "./types";

const tokenSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    apiKey: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: Array,
        required: true
    },
    installationUrl: String,
    permissions: {
        type: Array,
        required: true
    }
  },
  { timestamps: true },
);

export default model<IToken>("Token", tokenSchema);
