import { Document } from "mongoose";
import { OAUTH_PERMISSIONS } from "../enum";

export interface IToken extends Document {
    name: string;

    apiKey: string;

    description: string;

    permission: OAUTH_PERMISSIONS[];
}
