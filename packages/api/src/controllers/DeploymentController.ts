import { Request, Response } from "express";
import { responseData } from "@/helpers";
import { DeploymentService } from "@/services";
import { log } from "@brimble/utils";

export class DeploymentController {
  public async getRepos(req: Request, res: Response) {
    const { q, limit = 10 } = req.query as any;
    const me = await req.body.ghclient.me();
    try {
      let data = await DeploymentService.allRepos(me, limit, q);
      return res.json(responseData("OK", false, 200, data));
    } catch (error) {
      return res
        .status(error.statusCode)
        .json(responseData(error.message, true, error.statusCode));
    }
  }

  public async getRepo(req: Request, res: Response) {
    const { repoName } = req.body;
    const repo = await req.body.ghclient.repo(repoName);
    try {
      const data = await DeploymentService.retrieveRepo(repo);

      return res.json(responseData("OK", false, 200, data));
    } catch (error) {
      return res
        .status(error.statusCode)
        .json(responseData(error.message, true, error.statusCode));
    }
  }
}
