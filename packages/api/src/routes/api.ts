import { Router, Request, Response } from "express";
import { IUser } from "@brimble/models";
// Middlewares
import { isLoggedIn } from "../middlewares";
import responseData from "../helpers/responseData";

export class Routes {
  public router: Router = Router();

  public routes(): Router {
    this.router.get("/", (req: Request, res: Response) => {
      res.json({ message: "Welcome to Brimble Api ✌🏻" });
    });

    this.router.get("/user/me", isLoggedIn, (req: Request, res: Response) => {
      const user: IUser = req.body.authUser;
      res.json(responseData("OK", false, 200, user));
    });

    return this.router;
  }
}
