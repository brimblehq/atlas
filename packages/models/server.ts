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
    grpc_address: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: false,
    },
    domain: {
      required: false,
      type: String,
    },
    webhook_url: String,
    ip_address: {
      type: String,
      required: true,
    },
    ipv6: String,
    private_ip_address: {
      type: String,
      required: true,
    },
    tunnel_token: {
      type: String,
      required: false,
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
    region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    tag: String,
    firewall_id: {
      required: false,
      type: String,
    },
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
