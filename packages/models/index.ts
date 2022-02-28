import dotenv from "dotenv";
import mongoose from "mongoose";
import { log } from "@brimble/utils";

// Connection to Mongo
const connectToMongo = async (mongoUrl: string): Promise<void> => {
  dotenv.config();

  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);

  try {
    await mongoose.connect(mongoUrl, options);
    log.info(`Database connection successful`);
  } catch (error) {
    log.error(`Error connecting to DB`, error);
    return process.exit(1);
  }
};

export default connectToMongo;
export { default as User } from "./user";
export { default as Project } from "./project";
export { default as Following } from "./following";
export { IUser, IGit, IProject, IFollowing } from "./types";