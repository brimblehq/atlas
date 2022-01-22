import { LeanDocument, ObjectId } from "mongoose";
import { IProject, Project } from "@brimble/models";
import { queryFilterDto } from "@/types";

class ProjectService {
  public async findAll(
    user_id: ObjectId,
    options: queryFilterDto,
  ): Promise<{
    projects: LeanDocument<IProject>[];
    totalPages: number;
    currentPage: number;
    filterBy: string;
  }> {
    try {
      const projects = await Project.find({ user_id })
        .limit(options.limit * 1)
        .skip((options.page - 1) * options.limit)
        .sort(`${options.filterBy}`)
        .lean()
        .exec();

      const count = await Project.countDocuments();

      return {
        projects,
        totalPages: Math.ceil(count / options.limit),
        currentPage: options.page,
        filterBy: options.filterBy,
      };
    } catch (error) {
      const { message } = error as Error;
      throw {
        message,
        statusCode: 500,
      };
    }
  }
}

export default new ProjectService();
