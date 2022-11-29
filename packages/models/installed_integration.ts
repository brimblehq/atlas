import { model, Schema } from "mongoose";
import { IInstalledIntegration } from "./types";

const installedIntegrationSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    integration_id: {
        type: Schema.Types.ObjectId,
        ref: "Integration",
        required: true,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
  },
  { timestamps: true },
);

export default model<IInstalledIntegration>("InstalledIntegration", installedIntegrationSchema);
