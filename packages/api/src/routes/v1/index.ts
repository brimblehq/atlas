import { Request, Response, Router } from "express";

// Controllers
import { DeploymentController, FollowerController, ProjectController } from "@/controllers";

// Middlewares
import { frameworkRequest, isLoggedIn, validate } from "@/middlewares";

class RoutesV1 {
  
  public router: Router = Router();
  public projectController: ProjectController = new ProjectController();
  public deployController: DeploymentController = new DeploymentController();
  private followerController: FollowerController = new FollowerController();

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
      this.deployController.getFramework,
    );

    // Get root dir
    this.router.get(
      "/rootdir",
      isLoggedIn,
      validate(frameworkRequest),
      this.deployController.getRootDir,
    );
    // Follow a user
    this.router.post(
      "/follow/:id",
      isLoggedIn,
      this.followerController.followUser,
    );

    return this.router;
  }
}

export default new RoutesV1();
