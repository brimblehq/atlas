import { LeanDocument, ObjectId } from "mongoose";
import { IProject, Project } from "@brimble/models";
import { defaultErrorDto, queryFilterDto } from "@/types";
import { detectFramework, githubRequest } from "@/helpers";

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

  public async getFramework(
    installation_id: number,
    repoName: string,
    branch: string,
    path: string,
  ) {
    try {
      const { data } = await githubRequest(
        `/repos/${repoName}/contents/${
          path ? `${path}/package.json` : "package.json"
        }?ref=${branch}`,
        installation_id,
      );
      const buff = Buffer.from(data.content, "base64");
      const content = buff.toString("ascii");
      return detectFramework(JSON.parse(content));
    } catch (error) {
      const { response, message, statusCode = 500 } = error as defaultErrorDto;
      if (response) {
        const { status, data } = response;
        if (status === 404) {
          throw {
            message: "Repository not found",
            statusCode: response.status,
          };
        }
        throw {
          message: data.message,
          statusCode: response.status,
        };
      }
      throw {
        message,
        statusCode,
      };
    }
  }
}

export default new ProjectService();
