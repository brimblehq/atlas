import { Document } from "mongoose";
import { JobStatus } from "../enum";

export interface IJob extends Document {
    title: string;
    jobId: string;
    url: string;
    method: string;
    schedule: string;
    headers?: Map<string, string>;
    maxAttempts?: number;
    attempts?: number;
    isRecurring: boolean;
    lastRun?: Date;
    nextRun?: Date;
    body?: any;
    status?: JobStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }