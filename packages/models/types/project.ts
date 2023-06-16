import { Document } from "mongoose";
import { GIT_TYPE, PROJECT_STATUS } from "../enum";
import { IDomain } from "./domain";
import { IEnv } from "./env";
import { ILog } from "./logs";
import { ITeam } from "./team";
import { IUser } from "./user";

export interface IProject extends Document {
  name: string;
  domains: Array<IDomain>;
  environments: Array<IEnv>;
  uuid: number;
  pid: number;
  port: number;
  dir: string;
  buildCommand: string;
  outputDirectory: string;
  user_id: IUser;
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
  isPrivate: boolean;
  status: PROJECT_STATUS;
  framework: string;
  description: string;
  logs: Array<ILog>;
  log: ILog;
  maintenance: boolean;
  passwordEnabled: boolean;
  password: string;
  screenshot: string;
  createdAt: Date;
  updatedAt: Date;
  lastProcessed: number;
  tracking_token: string;
}
