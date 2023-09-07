import { Document } from "mongoose";
import { IDomain } from ".";

export interface IDns extends Document {
  name: string;
  ttl: number;
  type: string;
  value: string;
  domain: IDomain;
}
