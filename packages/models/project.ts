import { model, Schema } from "mongoose";
import { PROJECT_STATUS } from "./enum";
import { IProject } from "./types";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    uuid: {
      type: Number,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domains: [
      {
        ref: "Domain",
        type: Schema.Types.ObjectId,
      },
    ],
    environments: [
      {
        ref: "Env",
        type: Schema.Types.ObjectId,
      },
    ],
    team: {
      ref: "Team",
      type: Schema.Types.ObjectId,
    },
    pid: Number,
    port: Number,
    dir: String,
    buildCommand: String,
    outputDirectory: String,
    installCommand: String,
    repo: Object,
    rootDir: String,
    isPrivate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.PENDING,
    },
    framework: String,
    description: String,
    logs: [
      {
        ref: "Log",
        type: Schema.Types.ObjectId,
      },
    ],
    log: {
      ref: "Log",
      type: Schema.Types.ObjectId,
    },
    maintenance: {
      type: Boolean,
      default: false,
    },
    passwordEnabled: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: null
    },
    screenshot: String,
    lastProcessed: Number,
    tracking_token: String,
  },
  { timestamps: true },
);

export default model<IProject>("Project", projectSchema);
