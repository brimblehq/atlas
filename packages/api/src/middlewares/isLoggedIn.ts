import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "@brimble/models";
import { responseData } from "@/helpers";

const isLoggedIn = async (req: any, res: Response, next: NextFunction) => {
  const header = req.get("Authorization");
  if (!header) {
    return res.status(401).json(responseData("Not logged in"));
  }
  const token = header.split(" ")[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    if (!decoded) {
      return res.status(401).json(responseData("Unauthorized"));
    }

    const user = await User.findOne({ _id: decoded._id });

    if (user) {
      req.body.authUser = user;
    } else {
      return res.status(404).json(responseData("User not found"));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json(responseData("Could not process authentication status"));
  }
  next();
};

export { isLoggedIn };
