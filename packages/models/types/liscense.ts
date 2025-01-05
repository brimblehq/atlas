import mongoose, { Document } from "mongoose";
import { LicenseStatus } from "../enum";

export interface ILicense extends Document {
    licenseKey: string;
    userId: mongoose.Types.ObjectId;
    teamId: mongoose.Types.ObjectId;
    status: LicenseStatus;
    subscriptionId: mongoose.Types.ObjectId;
    devices: Array<{
        deviceId: string;
        hostname: string;
        isActive: boolean;
    }>;
    maxDevices: number;
}
  