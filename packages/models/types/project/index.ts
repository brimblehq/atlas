import { Document } from "mongoose";
import { GIT_TYPE, PROJECT_STATUS } from "../../enum";
import { IDomain } from "../domain";
import { IEnv } from "../env";
import { ILog } from "../logs";
import { ITeam } from "../team";
import { IUser } from "../user";
import { IServer } from "../server";
import { IPreview } from "./preview";

export interface IProject extends Document {
  name: string;
  domains: Array<IDomain>;
  environments: Array<IEnv>;
  uuid: number;
  pid: number;
  port: number;
  ip: string;
  dir: string;
  installCommand: string;
  buildCommand: string;
  startCommand: string;
  outputDirectory: string;
  user_id: IUser;
  monitor_id: string;
  repo: {
    name: string;
    full_name: string;
    id: number;
    branch: string;
    installationId: number;
    git: GIT_TYPE;
  } | null;
  rootDir?: string;
  team: ITeam;
  server: IServer;
  isPrivate: boolean;
  status: PROJECT_STATUS;
  framework: string;
  description: string;
  logs: Array<ILog>;
  log: ILog;
  maintenance: boolean;
  passwordEnabled: boolean;
  disabled: boolean;
  password: string | null;
  screenshot: {
    image: string;
    public_id: string;
  };
  createdAt: Date;
  updatedAt: Date;
  container_stats_schedule_id: string | null;
  lastProcessed: number;
  tracking_token: string;
  from: string;
  previews: IPreview[];
  replicas: number;
  specs: {
    memory: number;
    cpu: number;
    storage: number;
    region: string;
  };
  last_requested: Date;
  isPaused: boolean;
  billable: boolean;
}
