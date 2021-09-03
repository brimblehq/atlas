import { Request, Response } from "express";
import { responseData } from "../helpers";

export class DeploymentController {
  public async getRepos(req: Request, res: Response) {
    const me = await req.body.ghclient.me();
    const data = await me.reposAsync();
    return res.json(responseData("OK", false, 200, data));
  }
  public async selectRepo(req: Request, res: Response) {
    const repo = await req.body.ghclient.repo(req.body.repo);
    const data = await repo.contentsAsync("package.json", "main").catch(() => {
      return res.json(responseData("Something went wrong", true, 500, {}));
    });
    let content = data[0].content;
    const buff = Buffer.from(content, "base64");
    content = buff.toString("ascii");
    content = JSON.parse(content);
    return res.json(responseData("OK", false, 200, content));
  }
}
