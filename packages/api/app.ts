import "tsconfig-paths/register";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import express, { Request, Response } from "express";

import { Routes } from "./src/routes/api";

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

    this.app.use("/api/v1", this.routePrv.routes());

    this.app.get("*", (req: Request, res: Response) => {
      res.redirect("/api/v1");
    });
  }
}

export default new App().app;
