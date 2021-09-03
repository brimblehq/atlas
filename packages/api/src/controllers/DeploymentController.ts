import { Request, Response } from "express";
import { githubClient, responseData } from "../helpers";

export class DeploymentController {
  public async index(req: Request, res: Response) {
    const client = githubClient(req.body.authUser.token.access_token);
    const me = await client.me();
    const data = await me.infoAsync();
    return res.json(responseData("OK", false, 200, data));
  }
}
