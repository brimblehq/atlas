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
  buildCommand: string;
  outputDirectory: string;
  installCommand: string;
  user_id: IUser;
  monitor_id: string;
  repo: {
    name: string;
    full_name: string;
    id: number;
    branch: string;
    installationId: number;
    git: GIT_TYPE;
  };
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
  screenshot: string;
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
  };
}
