import { model, Schema } from "mongoose";
import { IServer } from "./types";
import { SERVER_STATUS } from "./enum";

const serverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: String,
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    teamId: {
      type: Schema.Types.ObjectId, 
      ref: 'Team', 
      required: false 
    },
    ip_address: {
      type: String,
      required: true,
    },
    private_ip_address: {
      type: String,
      required: true,
    },
    type: String,
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
    region: String,
    tag: String,
    specifications: {
      type: Object,
      default: {},
      select: true,
    },
    meta: {
      type: Object,
      default: {},
      select: true,
    },
  },
  { timestamps: true },
);

export default model<IServer>("Server", serverSchema);
