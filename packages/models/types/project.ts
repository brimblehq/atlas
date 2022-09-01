import { Document } from "mongoose";
import { IDomain } from "./domain";
import { IEnv } from "./env";
import { IUser } from "./user";

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
  user: IUser;
  repo: {
    name: string;
    full_name: string;
    id: number;
    branch: string;
  };
  rootDir?: string;
}
