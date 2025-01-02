import { model, Schema } from "mongoose";
import { ILicense } from "./types/liscense";
import { LicenseStatus } from "./enum";

const licenseSchema: Schema = new Schema({
  licenseKey: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subscriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(LicenseStatus),
    default: LicenseStatus.ACTIVE
  },
}, { timestamps: true });

licenseSchema.index({ userId: 1, status: 1 });
licenseSchema.index({ licenseKey: 1 });

export default model<ILicense>('License', licenseSchema, 'licenses');