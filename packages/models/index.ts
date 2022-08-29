export { default as User } from "./user";
export { default as Project } from "./project";
export { default as Following } from "./following";
export { default as Integration } from "./integration";
export { default as Domain } from "./domain";
export { default as Env } from "./env";
export {
  IUser,
  IGit,
  IProject,
  IFollowing,
  IIntegration,
  IEnv,
  IDomain,
} from "./types";

import mongoose from "mongoose";
import { log } from "@brimble/utils";

// Connection to Mongo
export const connectToMongo = async (mongoUrl: string): Promise<void> => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);

  // connect to mongo
  mongoose.connect(mongoUrl, options);

  // listen for connection
  mongoose.connection.on("connected", () => {
    log.info("Database connection successful");
  });

  // listen for error
  mongoose.connection.on("error", ({ message }) => {
    log.error(`Error connecting to DB`, message);
    return process.exit(1);
  });
};
