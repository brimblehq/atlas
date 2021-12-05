import { createAppAuth } from "@octokit/auth-app";
import axios from "axios";

async function createJWT(installationId: number) {
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

async function githubRequest(url: string, installationId: number) {
  const token = await createJWT(installationId);

  const { data } = await axios.get(`https://api.github.com${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export default githubRequest;
