import { Document } from "mongoose";
import { ROLES } from "../enum";
import { IPermission } from "./permission";

export interface IRole extends Document {
    type: ROLES;

    description?: string;

    is_custom?: boolean;

    default_permissions: IPermission[];
}