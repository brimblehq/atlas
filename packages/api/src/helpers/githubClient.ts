import { createAppAuth } from "@octokit/auth-app";
import axios, { AxiosResponse } from "axios";

async function createJWT(installationId: number): Promise<string> {
  const auth = createAppAuth({
    appId: process.env.BRIMBLE_BUILD_ID || "",
    privateKey: process.env.BRIMBLE_BUILD_PRIVATE_KEY || "",
    installationId,
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  });

  const { token } = await auth({ type: "installation" });
  return token;
}

async function githubRequest(
  url: string,
  installationId: number,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  payload: any = {},
): Promise<AxiosResponse> {
  const token = await createJWT(installationId);
  let response: AxiosResponse;
  switch (method) {
    case "GET":
      response = await axios.get(`https://api.github.com${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/vnd.github.v3+json",
        },
      });
      break;

    case "POST":
      response = await axios.post(`https://api.github.com${url}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/vnd.github.v3+json",
        },
      });
      break;

    case "PATCH":
      response = await axios.patch(`https://api.github.com${url}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/vnd.github.v3+json",
        },
      });
      break;

    case "DELETE":
      response = await axios.delete(`https://api.github.com${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/vnd.github.v3+json",
        },
      });
      break;

    default:
      response = await axios.get(`https://api.github.com${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      break;
  }

  return response.data;
}

export default githubRequest;
