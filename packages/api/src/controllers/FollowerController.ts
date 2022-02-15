import { responseData } from "@/helpers";
import { FollowerService } from "@/services";
import { defaultErrorDto } from "@/types";
import { Request, Response } from "express";

export class FollowerController {
    async followUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            let save = await FollowerService.followUser(id);
            return res.status(201).json(responseData("OK", save));
        } catch (e) {
            const { message, statusCode } = e as defaultErrorDto;
            return res.status(statusCode).json(responseData(message));
        }
    }

    async fetchFollowers(){}

    async unFollowUser(){}
}