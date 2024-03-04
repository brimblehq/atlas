import { Document } from "mongoose";
import { IUser } from "./user";
import { IPermission } from "./permission";

export interface IMemberPermission extends Document {
    permission_id: IPermission;

    member_id: IUser;

    enabled: boolean;
}