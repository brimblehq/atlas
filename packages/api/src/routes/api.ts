import { Router, Request, Response } from "express";
import { IUser } from "@brimble/models";

// Controllers
import { DeploymentController } from "../controllers";

// Middlewares
import { isLoggedIn } from "../middlewares";
import responseData from "../helpers/responseData";

export class Routes {
  public router: Router = Router();
  public deploymentController: DeploymentController =
    new DeploymentController();

  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble Api ✌🏻" });
    });

    this.router.get("/user/me", isLoggedIn, (req: Request, res: Response) => {
      const user: IUser = req.body.authUser;
      res.json(responseData("OK", false, 200, user));
    });

    this.router.get("/repo", isLoggedIn, this.deploymentController.index);

    return this.router;
  }
}
