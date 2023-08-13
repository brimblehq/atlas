import { Document } from "mongoose";
import {SERVER_STATUS} from "../enum";

export interface IServer extends Document {
    name: string;

    url: string;

    ip_address: string;

    server_type: string;

    status: SERVER_STATUS;

    default: boolean;

    is_custom_provision: boolean;

    is_downscaled: boolean;
}