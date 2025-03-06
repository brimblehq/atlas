import { Schema, model } from "mongoose";
import { IRegion } from "./types/region";
import { REGION_CONTINENT } from "./enum";

const regionSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  continent: { type: String, enum: Object.values(REGION_CONTINENT) },
  enabled: { type: Boolean, default: false, select: true },
});

export default model<IRegion>("Region", regionSchema, "regions");
