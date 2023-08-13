import { model, Schema } from "mongoose";
import { IServer } from "./types";
import { SERVER_STATUS } from "./enum";

const serverSchema = new Schema(
  {
    name: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    ip_address: {
      ref: "Team",
      type: Schema.Types.ObjectId,
    },

    server_type: String,

    status: {
      type: String,
      enum: Object.values(SERVER_STATUS),
      default: SERVER_STATUS.Active,
    },

    default: Boolean,

    is_custom_provision: {
      type: Boolean,
      default: true
    },

    is_downscaled: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

export default model<IServer>("Server", serverSchema);