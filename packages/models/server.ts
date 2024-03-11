import { model, Schema } from "mongoose";
import { IServer } from "./types";
import { SERVER_STATUS } from "./enum";

const serverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ip_address: {
      type: String,
      required: true,
    },
    url: String,
    server_type: String,
    status: {
      type: String,
      enum: Object.values(SERVER_STATUS),
      default: SERVER_STATUS.Active,
    },
    default: Boolean,
    is_custom_provision: {
      type: Boolean,
      default: true,
    },
    is_downscaled: {
      type: Boolean,
      default: false,
    },
    region: String,
    tag: String,
  },
  { timestamps: true },
);

export default model<IServer>("Server", serverSchema);
