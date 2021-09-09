import { Router, Request, Response } from "express";

// Controllers
import { DeploymentController } from "@/controllers";

// Middlewares
import { isLoggedIn } from "@/middlewares";

export class Routes {
  public router: Router = Router();
  public deploymentController: DeploymentController =
    new DeploymentController();

  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble Api ✌🏻" });
    });

    this.router.get(
      "/user/repos",
      isLoggedIn,
      this.deploymentController.getRepos
    );

    this.router.post(
      "/user/repo",
      isLoggedIn,
      this.deploymentController.getRepo
    );

    this.router.post(
      "/user/repo/branches",
      isLoggedIn,
      this.deploymentController.getBranches
    );

    this.router.post(
      "/user/repo/branch/content",
      isLoggedIn,
      this.deploymentController.getPackageJson
    );

    return this.router;
  }
}
