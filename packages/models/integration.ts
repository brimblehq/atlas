import { model, Schema } from "mongoose";
import { INTEGRATION_TYPE } from "./enum";
import { IIntegration } from "./types";

const integrationSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      enum: Object.values(INTEGRATION_TYPE),
      required: true,
    },
    app_id: String,
    hook: String,
    scope_description: String,
    reference: String,
    token: String,
    extra: Object,
  },
  { timestamps: true },
);

export default model<IIntegration>("Integration", integrationSchema);
