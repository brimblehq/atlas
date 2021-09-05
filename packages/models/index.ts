import dotenv from "dotenv";
import mongoose from "mongoose";
import { log } from "@brimble/utils";
// Connection to Mongo
(async (): Promise<void> => {
  dotenv.config();

  const mongoUrl: string = `${process.env.MONGODB_URI}`;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.set("useFindAndModify", false);
  try {
    await mongoose.connect(mongoUrl, options);
    log.info(`Database connection successful`);
  } catch (error) {
    log.error(`Error connecting to DB`, error);
    return process.exit(1);
  }
})();

export { default as User } from "./user";
export { default as OauthUser } from "./oauthUser";
export { IUser, IOauthUser } from "./types";
