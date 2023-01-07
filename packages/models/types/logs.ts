import { PROJECT_STATUS } from "../enum";
import { IProject } from "./project";
import { IUser } from "./user";

export interface ILog extends Document {
  logFile: string;
  name: string;
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
  startTime: Date;
  endTime: Date;
}
