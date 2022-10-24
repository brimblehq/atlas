import { ROLES } from "../enum";
import { ITeam, IUser } from "./";

export interface IMember extends Document {
  user: IUser;
  team: ITeam;
  role: ROLES;
}
