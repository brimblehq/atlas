import mongoose, { model, Schema } from "mongoose";
import { IJob } from "./types/job";
import { JobStatus } from "./enum";
    
const jobSchema: Schema = new Schema({
  title: { type: String, required: true },
  jobId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  method: { type: String, required: true },
  schedule: { type: String, required: true },
  headers: { type: Map, of: String },
  maxAttempts: { type: Number, default: 5 },
  attempts: { type: Number, default: 0 },
  isRecurring: { type: Boolean, required: true },
  lastRun: Date,
  nextRun: Date,
  body: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  status: {
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.SCHEDULED,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model<IJob>('Job', jobSchema, 'scheduled_jobs');
    