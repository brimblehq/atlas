import { Request, Response, Router } from "express";

// Controllers
import {
  DeploymentController,
  FollowingController,
  ProjectController,
} from "@/controllers";

// Middlewares
import { frameworkRequest, isLoggedIn, validate } from "@/middlewares";

class RoutesV1 {
  public router: Router = Router();
  public projectController: ProjectController = new ProjectController();
  public deployController: DeploymentController = new DeploymentController();
  private followingController: FollowingController = new FollowingController();

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

    //fetch the user following
    this.router.get(
      "/followings",
      isLoggedIn,
      this.followingController.fetchFollowing,
    );

    //fetch the user followers
    this.router.get(
      "/followers",
      isLoggedIn,
      this.followingController.fetchFollowers,
    );

    //follow a user
    this.router.post(
      "/follow/:id",
      isLoggedIn,
      this.followingController.followUser,
    );

    //unfollow a user
    this.router.delete(
      "/un-follow/:id",
      isLoggedIn,
      this.followingController.unFollowUser,
    );

    return this.router;
  }
}

export default new RoutesV1();
