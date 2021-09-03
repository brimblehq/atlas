const github = require("octonode");

const githubClient = (token: string) => {
  return github.client(token);
};

export default githubClient;
