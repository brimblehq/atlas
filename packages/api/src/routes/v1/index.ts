import { Request, Response, Router } from "express";

// Controllers
import { DeploymentController, ProjectController } from "@/controllers";
import { isLoggedIn } from "@/middlewares";

// Middlewares

class RoutesV1 {
  public router: Router = Router();
  public deploymentController: DeploymentController =
    new DeploymentController();
  public projectController: ProjectController = new ProjectController();
  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble API v1 ✌🏻" });
    });

    // Projects
    this.router.get("/projects", isLoggedIn, this.projectController.index);

    return this.router;
  }
}

export default new RoutesV1();
