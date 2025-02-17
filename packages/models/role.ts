import { Schema, model } from "mongoose";
import { ROLES } from "./enum";
import { IRole } from "./types/role";

const roleSchema = new Schema({
  type: { type: String, enum: Object.values(ROLES) },
  description: { type: String },
  is_custom: { type: Boolean, default: false },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
});

export default model<IRole>("Role", roleSchema);
