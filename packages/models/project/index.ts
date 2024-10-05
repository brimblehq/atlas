import { model, Schema } from "mongoose";
import { PROJECT_STATUS, ServiceType } from "../enum";
import { IProject } from "../types";
import { softDeletePlugin, SoftDeleteModel } from 'soft-delete-plugin-mongoose';

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    uuid: Number,
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monitor_id: {
      type: String,
      required: false,
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
    server: {
      ref: "Server",
      type: Schema.Types.ObjectId,
    },
    pid: Number,
    port: Number,
    ip: String,
    dir: String,
    installCommand: String,
    buildCommand: String,
    startCommand: String,
    outputDirectory: String,
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
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
    },
    screenshot: {
      image: String,
      public_id: String,
    },
    lastProcessed: Number,
    tracking_token: String,
    from: Schema.Types.ObjectId,
    container_stats_schedule_id: {
      type: String,
      default: null,
    },
    previews: [
      {
        ref: "Preview",
        type: Schema.Types.ObjectId,
      },
    ],
    replicas: {
      type: Number,
      default: 3,
    },
    specs: Object,
    last_requested: Schema.Types.Date,
    isPaused: Boolean,
    dbImage: {
      ref: "DbImage",
      type: Schema.Types.ObjectId,
      required: false,
    },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      default: ServiceType.WebService,
    },
    billable: {
      type: Boolean,
      default: false,
    },
    uri: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

projectSchema.plugin(softDeletePlugin);

export default model<IProject, SoftDeleteModel<IProject>>('Project', projectSchema);