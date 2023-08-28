import { Document } from "mongoose";
import { IServer } from "../server";
import { IProject } from ".";

export interface IPreview extends Document {
  name: string;
  pid: number;
  port: number;
  ip: string;
  dir: string;
  branch: string;
  server: IServer;
  project: IProject;
}
