import { model, Schema } from "mongoose";
import { GIT_TYPE, INTEGRATION_TYPE } from "./enum";
import { IIntegration } from "./types";

const integrationSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: INTEGRATION_TYPE,
      required: true,
    },
    app_id: String,
    hook: String,
    reference: String,
    token: String,
  },
  { timestamps: true },
);

export default model<IIntegration>("Integration", integrationSchema);
