import { Request, Response } from "express";
import { responseData } from "@/helpers";
import { DeploymentService } from "@/services";
import { defaultErrorDto } from "@/types";

export class DeploymentController {
  public async getRepos(req: Request, res: Response) {
    const { q, limit = 10 } = req.query as any;
    const me = await req.body.ghclient.me();

    DeploymentService.allRepos(me, limit, q)
      .then((data) => {
        return res.json(responseData("OK", false, 200, data));
      })
      .catch((error: defaultErrorDto) => {
        return res
          .status(error.statusCode)
          .json(responseData(error.message, true, error.statusCode));
      });
  }

  public async getRepo(req: Request, res: Response) {
    const { repoName } = req.body;
    const repo = await req.body.ghclient.repo(repoName);

    DeploymentService.retrieveRepo(repo)
      .then((data) => {
        return res.json(responseData("OK", false, 200, data));
      })
      .catch((error: defaultErrorDto) => {
        return res
          .status(error.statusCode)
          .json(responseData(error.message, true, error.statusCode));
      });
  }

  public async getBranches(req: Request, res: Response) {
    const { repoName } = req.body;
    const repo = await req.body.ghclient.repo(repoName);

    DeploymentService.repoBranches(repo)
      .then((data) => {
        return res.json(responseData("OK", false, 200, data));
      })
      .catch((error: defaultErrorDto) => {
        return res
          .status(error.statusCode)
          .json(responseData(error.message, true, error.statusCode));
      });
  }
}
