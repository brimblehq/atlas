import { Document } from "mongoose";
import { ENVIRONMENT, PROJECT_STATUS } from "../enum";
import { IProject } from "./project";
import { IUser } from "./user";
import { IPreview } from "./project/preview";
import { ITeam } from "./team";

export interface ILog extends Document {
  name: string;
  key: string;
  commit: {
    sha: string;
    branch: string;
    message: string;
    committer: {
      name: string;
      email: string;
      username: string;
    };
  };
  status: PROJECT_STATUS;
  project: IProject;
  user?: IUser;
  team?: ITeam;
  jobs: {
    id: number;
    name: string;
  }[];
  environment: ENVIRONMENT;
  preview: IPreview;
  startTime: Date | string;
  endTime: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deleted: boolean;
}
