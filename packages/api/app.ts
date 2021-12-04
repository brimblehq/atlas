import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import swaggerUI from "swagger-ui-express";
import connectToMongo from "@brimble/models";

import docs from "./docs";
import { apiV1 } from "@/routes/api";
import { PusherService } from "@/services";

dotenv.config({
  path: process.env.NODE_ENV !== "production" ? ".env.local" : ".env.prod",
});

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // Connect to MongoDB
    connectToMongo(process.env.MONGODB_URI || "");
    // support application/json type post data
    this.app.use(express.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());

    // Listen to events from Pusher
    PusherService.githubEvent();

    this.app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs));

    this.app.use("/api/v1", apiV1.routes());
  }
}

export default new App().app;
