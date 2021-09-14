import "tsconfig-paths/register";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
const totoro = require("totoro-node");

import docs from "./docs";
import { Routes } from "@/routes/api";

dotenv.config();

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // support application/json type post data
    this.app.use(express.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(cors());

    this.app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs));

    this.app.use("/api", totoro.rain(this.routePrv.routes()));
  }
}

export default new App().app;
