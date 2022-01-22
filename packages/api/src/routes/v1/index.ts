import { Request, Response, Router } from "express";

// Controllers
import { ProjectController } from "@/controllers";

// Middlewares
import { frameworkRequest, isLoggedIn, validate } from "@/middlewares";

class RoutesV1 {
  public router: Router = Router();
  public projectController: ProjectController = new ProjectController();

  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble API v1 ✌🏻" });
    });

    // Projects
    this.router.get("/projects", isLoggedIn, this.projectController.index);

    // Get web framework
    this.router.get(
      "/framework",
      isLoggedIn,
      validate(frameworkRequest),
      this.projectController.getFramework,
    );

    return this.router;
  }
}

export default new RoutesV1();
