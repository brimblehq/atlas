import { Document } from "mongoose";

export interface IDbImage extends Document {
    name: string;
    image_url: string;
    version: string;
    envs: string[];
    is_available: boolean;
    is_default: boolean;
    image: string;
}