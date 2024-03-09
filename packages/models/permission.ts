import { Schema, model } from "mongoose";
import { IPermission } from "./types/permission";
import { PERMISSION_TYPE } from "./enum";

const permissionSchema = new Schema({
    title: { type: String },
    role: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    type: { type: String, enum: Object.values(PERMISSION_TYPE) }
});

export default model<IPermission>("Permission", permissionSchema);