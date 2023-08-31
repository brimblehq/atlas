import { Document } from "mongoose";
import { CARD_TYPES } from "../enum";

export interface ICard extends Document {
  user_id: string;

  last4: string;

  card_type: CARD_TYPES;

  preferred: boolean;

  exp_month: string;

  exp_year: string;

  signature: string;

  authorization_code: string;
}
