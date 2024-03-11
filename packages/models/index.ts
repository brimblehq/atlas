export { default as User } from "./user";
export { default as Project } from "./project";
export { default as Preview } from "./project/preview";
export { default as Following } from "./following";
export { default as Integration } from "./integration";
export { default as Domain } from "./domain";
export { default as Dns } from "./domain/dns";
export { default as Env } from "./env";
export { default as Token } from "./token";
export { default as Team } from "./team";
export { default as Member } from "./member";
export { default as Permission } from "./permission";
export { default as MemberPermission } from "./member-permission";
export { default as Role } from "./role";
export { default as Log } from "./logs";
export { default as SubscriptionPlan } from "./subscription";
export { default as Card } from "./card";
export { default as Server } from "./server";
export { default as Wallet } from "./wallet";
export {
  IUser,
  IGit,
  IProject,
  IPreview,
  IFollowing,
  IIntegration,
  IEnv,
  IServer,
  IDomain,
  IToken,
  IMember,
  ITeam,
  IInstalledIntegration,
  ILog,
  ISubscription,
  ICard,
  IDns,
  IRole,
  IPermission,
  IMemberPermission,
  IWallet
} from "./types";
export {
  GIT_TYPE,
  INTEGRATION_TYPES,
  INTEGRATION_PROVIDERS,
  OAUTH_PERMISSIONS,
  ENVIRONMENT,
  SERVER_STATUS,
  ROLES,
  SUBSCRIPTION_PLAN_TYPE,
  PROJECT_STATUS,
  SUBSCRIPTION_STATUS,
  CARD_TYPES,
  DNS_TYPE,
  PERMISSION_TYPE
} from "./enum";

import mongoose from "mongoose";
import { log } from "@brimble/utils";

export const connectToMongo = async (
  mongoUrl: string,
  config?: mongoose.ConnectOptions,
): Promise<void> => {
  const options: mongoose.ConnectOptions = {
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    ...config,
  };

  mongoose.connect(mongoUrl, options).catch((err) => {
    log.error(`Unable to connect to mongo db, ${err}`);
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
