import { Document } from "mongoose";
import { DatabaseEngine } from "../enum";

export interface IDbImage extends Document {
  name: DatabaseEngine;
  image_url: string;
  version: string;
  envs: string[];
  is_available: boolean;
  is_default: boolean;
  image: string;
  has_port: boolean;
}
