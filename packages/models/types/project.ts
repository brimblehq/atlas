import { Document } from "mongoose";
import { GIT_TYPE } from "../enum";
import { IDomain } from "./domain";
import { IEnv } from "./env";

export interface IProject extends Document {
  name: string;
  domains: Array<IDomain>;
  environments: Array<IEnv>;
  uuid: number;
  pid: number;
  port: number;
  dir: string;
  buildCommand: string;
  outputDirectory: string;
  user_id: string;
}
