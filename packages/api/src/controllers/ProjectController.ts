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
}
