export { default as User } from "./user";
export { default as Project } from "./project";
export { default as Following } from "./following";
export { default as Integration } from "./integration";
export { default as Domain } from "./domain";
export { default as Env } from "./env";
export { default as Token } from "./token";
export { default as Team } from "./team";
export { default as Member } from "./member";
export {
  IUser,
  IGit,
  IProject,
  IFollowing,
  IIntegration,
  IEnv,
  IDomain,
  IToken,
  IMember,
  ITeam,
} from "./types";
export {
  GIT_TYPE,
  INTEGRATION_TYPE,
  OAUTH_PERMISSIONS,
  ENVIRONMENT,
  ROLES,
  PROJECT_STATUS,
} from "./enum";

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
    console.log("Database connection successful 🚀");
  });

  // listen for error
  mongoose.connection.on("error", ({ message }) => {
    log.error(`Error connecting to DB`, message);
    return process.exit(1);
  });
};

export const closeMongo = () => {
  mongoose.connection.close(true);
};
