import { model, Schema } from "mongoose";
import { IDomain } from "../types";

const domainSchema = new Schema(
  {
    project: {
      ref: "Project",
      type: Schema.Types.ObjectId,
      required: false,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    team_id: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    is_discounted: {
      type: Boolean,
      default: false,
    },
    privacy_enabled: {
      type: Boolean,
      default: false,
    },
    renewal_date: {
      type: String,
      required: false,
    },
    renewal_price: {
      type: Number,
      required: false,
    },
    preview: {
      ref: "Preview",
      type: Schema.Types.ObjectId,
    },
    nameservers: {
      type: Array,
      required: false,
    },
    purchased: {
      type: Boolean,
      default: false
    },
    dns: [
      {
        ref: "Dns",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

export default model<IDomain>("Domain", domainSchema);
