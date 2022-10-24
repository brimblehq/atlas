import { IMember, IProject } from "./";

export interface ITeam extends Document {
  name: string;
  description: string;
  members: Array<IMember>;
  projects: Array<IProject>;
  avatar: string;
}
