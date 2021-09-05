import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { User, OauthUser } from "@brimble/models";
import { githubClient } from "@/helpers";

const isLoggedIn = async (req: any, res: Response, next: NextFunction) => {
  const header = req.get("Authorization");
  if (!header) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  const token = header.split(" ")[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let user;
    if (decoded.oauth_provider) {
      user = await OauthUser.findOne({ _id: decoded._id });
    } else {
      user = await User.findOne({ _id: decoded._id });
    }
    if (user) {
      if (
        decoded.oauth_provider &&
        user.token &&
        typeof user.token != "string"
      ) {
        req.body.ghclient = githubClient(user.token.access_token);
      }
      req.body.authUser = user;
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Could not process authentication status" });
  }
  next();
};

export { isLoggedIn };
