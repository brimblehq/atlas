export { default as User } from "./user";
export { default as Project } from "./project";
export { default as Following } from "./following";
export { default as Integration } from "./integration";
export { default as Domain } from "./domain";
export { default as Env } from "./env";
export { default as Token } from "./token";
export { default as Team } from "./team";
export { default as Member } from "./member";
export { default as Log } from "./logs";
export { default as SubscriptionPlan } from "./subscription_plan";
export { default as Card } from "./card";
export { default as Server } from "./server";
export { default as Tenancy } from "./tenancy";

export {
  IUser,
  IGit,
  IProject,
  IFollowing,
  IIntegration,
  IEnv,
  IServer,
  ITenancy,
  IDomain,
  IToken,
  IMember,
  ITeam,
  IInstalledIntegration,
  ILog,
  ISubscriptionPlan,
  ICard
} from "./types";
export {
  GIT_TYPE,
  INTEGRATION_TYPES,
  INTEGRATION_PROVIDERS,
  OAUTH_PERMISSIONS,
  ENVIRONMENT,
  SERVER_STATUS,
  ROLES,
  PROJECT_STATUS,
  SUBSCRIPTION_STATUS,
  CARD_TYPES
} from "./enum";

import mongoose from "mongoose";
import { log } from "@brimble/utils";

// Connection to Mongo
export const connectToMongo = async (
  mongoUrl: string,
  retryCount?: number,
): Promise<void> => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10,
    socketTimeoutMS: 30000,
  };
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);

  // connect to mongo
  mongoose.connect(mongoUrl, options).catch((err) => {
    if (retryCount && retryCount > 0) {
      setTimeout(() => {
        connectToMongo(mongoUrl, retryCount - 1);
      }, 5000);
    } else process.exit(1);
  });

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

export const db = mongoose.connection;

export const closeMongo = () => mongoose.connection.close(true);
