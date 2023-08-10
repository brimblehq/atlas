import { Document } from "mongoose";
import {SERVER_STATUS} from "../enum";

export interface IServer extends Document {
    name: string;

    url: string;

    ip_address: string;

    provider_id: string;

    status: SERVER_STATUS;

    default: boolean;
}