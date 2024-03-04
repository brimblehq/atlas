import { Document } from "mongoose";
import { IRole } from "./role";
import { PERMISSION_TYPE } from "../enum";

export interface IPermission extends Document {
  title: string;

  role: IRole;

  type: PERMISSION_TYPE;
}
