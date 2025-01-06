import { Document } from "mongoose";
import { SERVER_STATUS } from "../enum";

export interface IServer extends Document {
  name: string;

  url: string;

  ip_address: string;

  private_ip_address: string;

  server_type: string;

  status: SERVER_STATUS;

  default: boolean;

  tag: string;

  region: string;

  is_custom_provision: boolean;

  specifications: Record<any, any>;

  meta: Record<any, any>;
}
