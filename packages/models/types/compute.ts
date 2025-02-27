import { IProject } from "./project";
import { ITeam } from "./team";
import { IUser } from "./user";

export interface IComputeChange {
  _id?: string;
  project_id: IProject;
  user_id: IUser;
  team_id: ITeam;
  timestamp: Date;
  previous: {
    cpu: number;
    memory: number;
    storage: number;
  };
  current: {
    cpu: number;
    memory: number;
    storage: number;
  };
  costs: {
    startDate: Date;
    endDate?: Date;
    cpuCost: number;
    memoryCost: number;
    storageCost: number;
    totalCost: number;
  };
  billed: boolean;
}
