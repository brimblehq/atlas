import { IProject } from "./project";
import { ISubscription } from "./subscription";
import { ITeam } from "./team";
import { IUser } from "./user";

export interface IComputeChange {
  _id?: string;
  project_id: IProject;
  user_id: IUser;
  team_id?: ITeam;
  subscription_id: ISubscription;
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
