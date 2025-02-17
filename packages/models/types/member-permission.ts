import { Document } from "mongoose";
import { IPermission } from "./permission";
import { IMember } from "./member";

export interface IMemberPermission extends Document {
  permission: IPermission;

  member: IMember;

  enabled: boolean;
}
