import { ITeam } from "./team";

export interface IInvitation extends Document {
  email: string;
  team: ITeam;
  accepted: boolean;
}
