import { model, Schema } from "mongoose";
import { INTEGRATION_PROVIDERS, INTEGRATION_TYPES } from "./enum";
import { IIntegration } from "./types";

const integrationSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    name: {
      type: String,
      enum: Object.values(INTEGRATION_PROVIDERS),
      required: true,
    },
    app_id: String,
    hook: String,
    scope_description: Array,
    reference: String,
    type: {
      type: String,
      enum: Object.values(INTEGRATION_TYPES),
      required: true,
    },
    token: String,
    extra: Object,
  },
  { timestamps: true },
);

export default model<IIntegration>("Integration", integrationSchema);
