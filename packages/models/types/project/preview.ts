import { Document } from "mongoose";
import { IServer } from "../server";
import { IProject } from ".";
import { PROJECT_STATUS } from "../../enum";
import { ILog } from "../logs";

export interface IPreview extends Document {
  name: string;
  healthCheckPath?: string;
  pid: number;
  port: number;
  ip: string;
  dir: string;
  branch: string;
  server: IServer;
  project: IProject;
  issue_comment_id: number;
  status: PROJECT_STATUS;
  log: ILog;
  last_requested: Date;
  isPaused: boolean;
}
