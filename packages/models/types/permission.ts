import { Document } from "mongoose";
import { IRole } from "./role";
import { PERMISSION_TYPE } from "../enum";

export interface IPermission extends Document {
  name: string;

  role_id: IRole;

  type: PERMISSION_TYPE;
}
