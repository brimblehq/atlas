import { Request, Response } from "express";
import { Project } from "@brimble/models";

export class ProjectController {
  public async index(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      message: await Project.find(),
    });
  }
}
