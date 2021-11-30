import { Document } from "mongoose";
import { GIT_TYPE } from "../enum";

export interface IProject extends Document {
  name: string;
  description?: string;
  type: GIT_TYPE;
  private: boolean;
  live?: boolean;
  stars: number;
}
