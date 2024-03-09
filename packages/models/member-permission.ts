import { Schema, model } from "mongoose";
import { IMemberPermission } from "./types/member-permission";

const memberPermissionSchema = new Schema({
    permission: { type: Schema.Types.ObjectId, ref: 'Permission' },
    member: { type: Schema.Types.ObjectId, ref: 'Member' },
    enabled: { type: Boolean, default: false }
});

export default model<IMemberPermission>("MemberPermission", memberPermissionSchema);