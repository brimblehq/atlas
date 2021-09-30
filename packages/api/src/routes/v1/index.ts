import { Request, Response, Router } from "express";

// Controllers
import { DeploymentController } from "@/controllers";

// Middlewares

class RoutesV1 {
  public router: Router = Router();
  public deploymentController: DeploymentController =
    new DeploymentController();
  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble API v1 ✌🏻" });
    });

    return this.router;
  }
}

export default new RoutesV1();
