import { Router, Request, Response } from "express";
// Middlewares
import { isLoggedIn } from "../middlewares";

export class Routes {
  public router: Router = Router();

  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble Api ✌🏻" });
    });

    this.router.get("/user/me", isLoggedIn, (req: Request, res: Response) => {
      res.json({ user: req.body.authUser });
    });

    return this.router;
  }
}
