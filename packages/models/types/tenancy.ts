import { Document } from "mongoose";
import { IServer } from "./server";
import { ITeam } from "./team";
import { IUser } from "./user";

export interface ITenancy extends Document {
  user: IUser;

  team: ITeam;

  server: IServer;

  username: string;

  password: string;

  memory: number;

  storage: number;
}