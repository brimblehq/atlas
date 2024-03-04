import { Document } from "mongoose";
import { ROLES } from "../enum";
import { ITeam, IUser } from "./";
import { IMemberPermission } from "./member-permission";

export interface IMember extends Document {
  user: IUser;
  team: ITeam;
  role: ROLES;
  accepted: boolean;
  invitedBy: IUser;
  email: string;
  permissions: IMemberPermission[]
}
