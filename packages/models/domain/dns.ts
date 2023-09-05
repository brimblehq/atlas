import { model, Schema } from "mongoose";
import { IDns } from "../types";
import { DNS_TYPE } from "../enum";

const dnsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ttl: {
    type: Number,
    default: 3600,
  },
  type: {
    type: String,
    enum: Object.values(DNS_TYPE),
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  domain: {
    type: Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
});

export default model<IDns>("Dns", dnsSchema);
