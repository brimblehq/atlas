import { isValidObjectId, responseData } from "@/helpers";
import { FollowingService, UserService } from "@/services";
import { defaultErrorDto } from "@/types";
import { Request, Response } from "express";

export class FollowingController {

  async followUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const isValid = isValidObjectId(id);
      if (isValid == false) {
        return res.status(400).json(responseData("Invalid object id"));
      }
      //check if user exist
      let check = await UserService.fetchByID(id);

      if (!check) {
        return res.status(401).json(responseData("Follower with this id not found"));
      }

      const save = await FollowingService.followUser(req.body.authUser._id, id);

      return res.status(201).json(responseData("OK", save)); 
    } catch (e) {
      const { message, statusCode } = e as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }

  async fetchFollowing(req: Request, res: Response) {
    try{
      //@ts-ignore
      const followings = await FollowingService.fetchFollowing(req.body.authUser._id);
      return res.status(201).json(responseData("OK", followings));
    } catch (e) {
      const { message, statusCode } = e as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }

  async fetchFollowers(req: Request, res: Response){
    try {
      //@ts-ignore
      const followers = await FollowingService.fetchfollowers(req.body.authUser._id);
      return res.status(201).json(responseData("OK", followers));
    } catch (e) {
      const { message, statusCode } = e as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }

  async unFollowUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const isValid = isValidObjectId(id);
      if (isValid == false) {
        return res.status(400).json(responseData("Invalid object id"));
      }
      //check if user exist
      let check = await UserService.fetchByID(id);

      if (!check) {
        return res.status(401).json(responseData("Follower with this id not found"));
      }
      //@ts-ignore
      const following = await FollowingService.unfollowUser(req.body.authUser._id, id);
      if (following.deletedCount == 1){
        return res.status(201).json(responseData("Unfollowed successfully", {
          followed_id: id
        }));
      }
    } catch (e) {
      const { message, statusCode } = e as defaultErrorDto;
      return res.status(statusCode).json(responseData(message));
    }
  }
}
