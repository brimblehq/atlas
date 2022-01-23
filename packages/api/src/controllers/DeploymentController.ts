import { responseData } from "@/helpers";
import { DeploymentService } from "@/services";
import { defaultErrorDto } from "@/types";
import { Request, Response } from "express";

export class DeploymentController {
  async getFramework(req: Request, res: Response): Promise<Response> {
    try {
      const { repo_name, git_provider, branch, path } = req.query as any;
      let framework: any = {};
      if (git_provider.toLowerCase() === "github") {
        framework = await DeploymentService.getFramework(
          req.body.authUser.github?.installation_id,
          repo_name,
          branch,
          path,
        );
      }

      return res.status(200).json(responseData("OK", framework));
    } catch (error) {
      const { message, statusCode } = error as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }

  async getRootDir(req: Request, res: Response): Promise<Response> {
    try {
      const { repo_name, git_provider, branch, path } = req.query as any;
      let rootDir: any = {};
      if (git_provider.toLowerCase() === "github") {
        rootDir = await DeploymentService.getRootDir(
          req.body.authUser.github?.installation_id,
          repo_name,
          branch,
          path,
        );
      }

      return res.status(200).json(responseData("OK", rootDir));
    } catch (error) {
      const { message, statusCode } = error as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }
}
