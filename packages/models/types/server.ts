import mongoose, { Document } from "mongoose";
import { SERVER_STATUS } from "../enum";
import { IRegion } from "./region";

export interface IServer extends Document {
  name: string;

  url: string;

  grpc_address?: string;

  ipv6?: string;

  domain?: string;

  userId: mongoose.Types.ObjectId;

  teamId?: mongoose.Types.ObjectId;

  ip_address: string;

  private_ip_address: string;

  tunnel_token: string;

  type: string;

  status: SERVER_STATUS;

  default: boolean;

  tag: string;

  region: IRegion;

  webhook_url?: string;

  is_custom_provision: boolean;

  firewall_id?: string;

  specifications: Record<any, any>;

  meta: Record<any, any>;
}
