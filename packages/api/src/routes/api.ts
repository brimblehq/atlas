import { Router, Request, Response } from "express";

export class Routes {
  public router: Router = Router();

  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble Api ✌🏻" });
    });

    return this.router;
  }
}
