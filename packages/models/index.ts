import dotenv from "dotenv";
import mongoose from "mongoose";
// Connection to Mongo
(async (): Promise<void> => {
  dotenv.config();

  const mongoUrl: string = `${process.env.MONGODB_URI}`;
  console.log(mongoUrl);
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.set("useFindAndModify", false);
  try {
    await mongoose.connect(mongoUrl, options);
    console.log(`Database connection successful`);
  } catch (error) {
    console.log(`Error connecting to DB`, error);
    return process.exit(1);
  }
})();

export { default as User } from "./user";
export { IUser } from "./types/user";
