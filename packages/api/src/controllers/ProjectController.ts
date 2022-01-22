import { Request, Response } from "express";
import { responseData } from "@/helpers";
import { defaultErrorDto } from "@/types";
import { ProjectService } from "@/services";

export class ProjectController {
  async index(req: Request, res: Response): Promise<Response> {
    const {
      limit = 10,
      page = 1,
      filterBy = "_id",
    }: { limit: number; page: number; filterBy: string } = req.query as any;

    try {
      const projects = await ProjectService.findAll(req.body.authUser._id, {
        limit,
        page,
        filterBy,
      });

      return res.status(200).json(responseData("OK", projects));
    } catch (error) {
      const { message, statusCode } = error as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }

  async getFramework(req: Request, res: Response): Promise<Response> {
    try {
      const { repo_name, git_provider } = req.query as any;
      let project: any = {};
      if (git_provider.toLowerCase() === "github") {
        project = await ProjectService.getFramework(
          req.body.authUser.github?.installation_id,
          repo_name,
        );
      }

      return res.status(200).json(responseData("OK", project));
    } catch (error) {
      const { message, statusCode } = error as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }
}
