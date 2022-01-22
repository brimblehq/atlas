import { detectFramework, githubRequest } from "@/helpers";
import { defaultErrorDto } from "@/types";

class DeploymentService {
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

export default new DeploymentService();
