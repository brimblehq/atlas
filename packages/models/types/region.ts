import { REGION_CONTINENT } from "../enum";

export interface IRegion extends Document {
  name: string;
  country: string;
  continent?: REGION_CONTINENT;
  enabled?: boolean;
}
