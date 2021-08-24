import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { User } from "@brimble/models";

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
    console.log(decoded._id);
    const user = await User.findOne({ _id: Types.ObjectId(decoded._id) });
    if (user) {
      req.body.authUser = user;
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(401).json({ message: error });
  }
  next();
};

export { isLoggedIn };
