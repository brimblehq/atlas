import { Document } from "mongoose";
import { IGit } from ".";
import { IFollowing, IProject, ITeam } from "./";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  email_verified_at: string;
  verification_token: number;
  token?: string;
  company?: string;
  github: IGit;
  gitlab: IGit;
  location: string;
  interests: Array<string>;
  bitbucket: IGit;
  following: IFollowing[];
  projects: IProject[];
  teams: ITeam[];
  avatar: string;
  freeTrialActive: boolean;
  activated: boolean;
  is_waitlist: boolean;
  notifications: {
    email: boolean;
    mute: boolean;
  }
}
