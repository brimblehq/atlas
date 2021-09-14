import { Router } from "express";

// Controllers
import { DeploymentController } from "@/controllers";

// Middlewares
import { isLoggedIn } from "@/middlewares";

export class Routes {
  public router: Router = Router();
  public deploymentController: DeploymentController =
    new DeploymentController();
  public routes() {
    return {
      v1: {
        active: true,
        deprecated: false,
        endpoints: [
          {
            route: "/github/repos",
            method: "GET",
            middleware: [isLoggedIn],
            active: true,
            deprecated: false,
            implementation: this.deploymentController.getRepos,
          },
          {
            route: "/github/repos",
            method: "POST",
            middleware: [isLoggedIn],
            active: true,
            deprecated: false,
            implementation: this.deploymentController.getRepo,
          },
          {
            route: "/github/repos/branches",
            method: "POST",
            middleware: [isLoggedIn],
            active: true,
            deprecated: false,
            implementation: this.deploymentController.getBranches,
          },
          {
            route: "/github/branch/content",
            method: "POST",
            middleware: [isLoggedIn],
            active: true,
            deprecated: false,
            implementation: this.deploymentController.getPackageJson,
          },
        ],
      },
    };
  }
}
