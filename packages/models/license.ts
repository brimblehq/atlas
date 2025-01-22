import { model, Schema } from "mongoose";
import { ILicense } from "./types/license";
import { LicenseStatus } from "./enum";

const licenseSchema: Schema = new Schema({
  licenseKey: { 
    type: String, 
    required: true, 
    unique: true 
  },
  infisicalIdentity: String,
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  teamId: {
    type: Schema.Types.ObjectId, 
    ref: 'Team', 
    required: false 
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
  tag: String,
  devices: [{
    deviceId: { 
      type: String, 
      required: true 
    },
    hostname: String,
    lastSeen: { 
      type: Date, 
      default: Date.now 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  }],
  maxDevices: { 
    type: Number, 
    required: true,
    default: 1 
  }
}, { timestamps: true });

// licenseSchema.index({ userId: 1, status: 1 });
// licenseSchema.index({ licenseKey: 1 });

licenseSchema.methods.cleanupInactiveDevices = async function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  this.devices = this.devices.filter((device: any) => 
    device.lastSeen > thirtyDaysAgo || device.isActive
  );
  
  await this.save();
};

export default model<ILicense>('License', licenseSchema, 'licenses');