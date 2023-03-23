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
      required: false,
      unique: true,
    },
    description: {
      type: Array,
      required: true
    },
    image: {
      type: String,
      required: true,
      unique: true,
    },
    installationUrl: String,
    redirectUrl: String,
    encodedToken: {
      type: String,
      default: null,
      required: true,
    },
    permissions: {
      type: Array,
      required: true
    }
  },
  { timestamps: true },
);

export default model<IToken>("Token", tokenSchema);
