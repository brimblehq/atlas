import { IMember, IProject, IInvitation } from "./";

export interface ITeam extends Document {
  name: string;
  description: string;
  members: Array<IMember>;
  projects: Array<IProject>;
  invitations: Array<IInvitation>;
  avatar: string;
}
