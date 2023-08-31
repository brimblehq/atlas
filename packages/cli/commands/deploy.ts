import { detectFramework, log } from "@brimble/utils";
import chalk from "chalk";
import dotenv from "dotenv";
import inquirer from "inquirer";
import isValidDomain from "is-valid-domain";
import path from "path";
import Conf from "configstore";
import ora from "ora";
import slugify from "slugify";
const open = require("better-opn");
import {
  dirValidator,
  getFiles,
  getGitIgnore,
  getIgnoredFiles,
  git,
  isLoggedIn,
  projectConfig,
  setupAxios,
  socket,
} from "../helpers";
import { GIT_TYPE } from "@brimble/models";
import { sendToServer } from "../services/deployRequest";

dotenv.config();

const config = new Conf("brimble");
const spinner = ora();

const deploy = async (
  directory: string = process.cwd(),
  options: {
    open: boolean;
    domain: string;
    silent: boolean;
    name: string;
    projectID: string;
  } = {
    open: false,
    domain: "",
    silent: false,
    name: "",
    projectID: "",
  },
) => {
  try {
    const user = isLoggedIn();
    if (!user) {
      log.error(chalk.red("You are not logged in"));
      process.exit(1);
    }

    const { folder, files } = dirValidator(directory);
    const projectConf = await projectConfig();
    const proj = projectConf.get("project");
    let filesToUpload = getFiles(folder);
    let buildCommand = "";
    let outputDirectory = "";
    const hasPackageJson = files.includes("package.json");

    if (hasPackageJson) {
      const ignoredFiles = await getIgnoredFiles(folder);
      ignoredFiles.forEach((file: string) => {
        filesToUpload = filesToUpload.filter((f: any) => !f.includes(file));
      });
      const packageJson = require(path.resolve(folder, "package.json"));
      const framework = detectFramework(packageJson);
      buildCommand = framework.settings.buildCommand || "yarn build";
      outputDirectory = framework.settings.outputDirectory || "dist";
    }

    const oauth = user.oauth;
    const hasGit = await git.revparse(["--is-inside-work-tree"]).catch(() => {
      return false;
    });

    if (
      (!proj || !proj.id) &&
      (!options.projectID || !config.get(options.projectID))
    ) {
      const { createProject } = await inquirer.prompt([
        {
          type: "confirm",
          name: "createProject",
          message: "Initialize project?",
          default: true,
        },
      ]);

      if (!createProject) {
        throw new Error("Project not initialized");
      }

      // Function to initialize project
      const initProject = async (repo?: any) => {
        const answer = await askQuestions({
          token: user.token,
          folder,
          filesToUpload,
          buildCommand,
          outputDirectory,
          hasPackageJson,
        });
        const gitDir = await git.revparse(["--show-toplevel"]);
        const rootDir = path.relative(gitDir, folder);

        spinner.start("Initializing project");
        const { data } = await setupAxios(user.token).post(`/init`, {
          name: slugify(answer.name, { lower: true }),
          repo: repo ? repo : {},
          buildCommand: answer.buildCommand,
          outputDirectory: answer.outputDirectory,
          domain: answer.domain,
          rootDir,
          dir: !repo ? folder : "",
        });

        return { data, answer };
      };
      // End of initProject function

      if (oauth && hasGit) {
        if (oauth.toUpperCase() !== GIT_TYPE.GITHUB) {
          throw new Error("Only Github is supported for now");
        } else {
          spinner.start("Searching for repositories");
          setupAxios(user.token)
            .get(`/repos/${oauth.toLowerCase()}`)
            .then(async ({ data }) => {
              spinner.stop();
              const repo = await listRepos(data.data, user.id);
              if (repo) {
                initProject(repo)
                  .then(async ({ data, answer }) => {
                    projectConf.set("project", {
                      id: data.projectId,
                    });

                    const gitignore = await getGitIgnore(folder);
                    if (gitignore) {
                      const branch = await git.revparse([
                        "--abbrev-ref",
                        "HEAD",
                      ]);
                      await git
                        .add(gitignore)
                        .commit("ci: added brimble.json to .gitignore");

                      spinner.start("Pushing to remote");
                      await git
                        .push(["-u", "origin", branch])
                        .then(() => {
                          spinner.stop();
                          log.warn(
                            chalk.yellow(
                              `Your site will be available at https://${answer.domain} shortly`,
                            ),
                          );
                          log.info(
                            chalk.blue(
                              `Run ${chalk.bold(
                                `brimble logs`,
                              )} to view progress`,
                            ),
                          );
                        })
                        .catch((err) => {
                          spinner.fail(err.message);
                          log.warn(chalk.yellow("Run git push manually"));
                        });
                      process.exit(0);
                    } else {
                      log.info(
                        chalk.yellow(
                          "No .gitignore found. You can add it manually by running `git add .gitignore` and `git commit -m 'ci: added brimble.json to .gitignore'`",
                        ),
                      );
                      process.exit(0);
                    }
                  })
                  .catch((err) => {
                    if (err.response) {
                      throw new Error(err.response.data.msg);
                    } else {
                      throw new Error(err.message);
                    }
                  });
              }
            })
            .catch(async (err) => {
              if (err.response) {
                spinner.fail(err.response.data.msg);
                const { install } = await inquirer.prompt([
                  {
                    type: "confirm",
                    name: "install",
                    message: `Would you like to connect with ${oauth.toUpperCase()}?`,
                    default: true,
                  },
                ]);
                if (install) {
                  open(
                    `https://github.com/apps/brimble-build/installations/new`,
                  );
                  spinner.start("Awaiting installation");
                  socket.on(
                    `${user.id}:repos`,
                    async ({ data: repos }: any) => {
                      spinner.stop();
                      socket.disconnect();
                      const repo = await listRepos(repos, user.id);
                      if (repo) {
                        initProject(repo)
                          .then(async ({ data }) => {
                            projectConf.set("project", {
                              id: data.projectId,
                            });
                          })
                          .catch((err) => {
                            if (err.response) {
                              throw new Error(err.response.data.msg);
                            } else {
                              throw new Error(err.message);
                            }
                          });
                      }
                    },
                  );
                } else {
                  process.exit(1);
                }
              } else if (err.request) {
                spinner.fail("Please check your internet connection");
                process.exit(1);
              } else {
                spinner.fail(`Failed with unknown error: ${err.message}`);
                process.exit(1);
              }
            });
        }
      } else {
        if (process.platform === "win32") {
          log.warn(
            chalk.yellow(
              "Windows is not supported yet; please connect with Github",
            ),
          );
          process.exit(1);
        }
        initProject()
          .then(async ({ data, answer }) => {
            projectConf.set("project", {
              id: data.projectId,
            });
            await sendToServer({
              folder,
              filesToUpload,
              buildCommand: answer.buildCommand || buildCommand,
              outputDirectory: answer.outputDirectory || outputDirectory,
              projectId: data.projectId,
              name: answer.name || options.name,
              domain: answer.domain || options.domain,
              options,
              token: user.token,
            });
          })
          .catch((err) => {
            if (err.response) {
              throw new Error(err.response.data.msg);
            } else {
              throw new Error(err.message);
            }
          });
      }
    } else if (oauth && hasGit) {
      if (oauth.toUpperCase() !== GIT_TYPE.GITHUB) {
        throw new Error("Only Github is supported for now");
      } else {
        log.warn(
          chalk.yellow(
            "Project already connected: all you have to do now is to push to git, and we'll handle the rest",
          ),
        );
        process.exit(1);
      }
    } else {
      await redeploy({
        token: user.token,
        id: proj.id || options.projectID,
        folder,
        filesToUpload,
        buildCommand,
        outputDirectory,
      });
    }
  } catch (err) {
    const { message } = err as Error;
    log.error(chalk.red(message));
    process.exit(1);
  }
};

const redeploy = async (options: any) => {
  return setupAxios(options.token)
    .get(`/projects/${options.id}`)
    .then(async ({ data }) => {
      const { project } = data;
      if (project.repo) {
        throw new Error(
          "Redeployment is not supported for projects with a repository use your version control system instead",
        );
      }
      await sendToServer({
        folder: options.folder,
        filesToUpload: options.filesToUpload,
        buildCommand: project.buildCommand || options.buildCommand,
        outputDirectory: project.outputDirectory || options.outputDirectory,
        projectId: project.id,
        name: options.name || project.name,
        domain: options.domain,
        options,
        token: options.token,
      });
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(err.response.data.msg);
      } else {
        throw new Error(err.message);
      }
    });
};

const listRepos = async (repos: any[], user_id: string) => {
  const remoteRepo = await git.getConfig("remote.origin.url");
  const { repo } = await inquirer.prompt([
    {
      type: "list",
      name: "repo",
      message: "Select a repository",
      choices: [
        ...repos?.map((repo: any) => ({
          name: repo.full_name,
          value: repo,
        })),
        {
          name: "Not listed? Add it",
          value: null,
        },
      ],
    },
  ]);

  if (!repo) {
    open(`https://github.com/apps/brimble-build/installations/new`);
    spinner.start("Awaiting installation");
    socket.on(`${user_id}:repos`, async ({ data: repos }: any) => {
      spinner.stop();
      socket.disconnect();
      await listRepos(repos, user_id);
    });
  } else if (
    remoteRepo &&
    remoteRepo.value?.split(".com/")[1].split(".git")[0] !== repo.full_name
  ) {
    const { changeRemote } = await inquirer.prompt([
      {
        type: "confirm",
        name: "changeRemote",
        message: "Change remote repository?",
        default: true,
      },
    ]);
    if (changeRemote) {
      open(`https://github.com/apps/brimble-build/installations/new`);
      spinner.start("Awaiting installation");
      socket.on(`${user_id}:repos`, async ({ data: repos }: any) => {
        spinner.stop();
        socket.disconnect();
        await listRepos(repos, user_id);
      });
    } else {
      throw new Error("Remote repository not found");
    }
  }

  return repo;
};

const askQuestions = async (data: any) => {
  const { name, buildCommand, outputDirectory, domain } = await inquirer.prompt(
    [
      {
        name: "name",
        message: "Name of the project",
        default: slugify(data.name || path.basename(data.folder), {
          lower: true,
        }),
        when: !data.name,
        validate: (input: string) => {
          if (!input) {
            return "Please enter a project name";
          } else {
            return setupAxios(data.token)
              .get(
                `/exists?name=${slugify(input, {
                  lower: true,
                })}`,
              )
              .then(() => {
                return true;
              })
              .catch((err) => {
                if (err.response) {
                  return `${err.response.data.msg}`;
                } else {
                  return `${err.message}`;
                }
              });
          }
        },
      },
      {
        name: "buildCommand",
        message: "Build command",
        default: data.buildCommand,
        when: data.hasPackageJson,
      },
      {
        name: "outputDirectory",
        message: "Output directory",
        default: data.outputDirectory,
        when: data.hasPackageJson,
      },
      {
        name: "domain",
        message: "Domain name",
        default: data.name
          ? `${data.name}.brimble.app`
          : ({ name }: { name: string }) => {
              return name ? `${name}.brimble.app` : "";
            },
        when: !data.domain,
        validate: (input: string) => {
          if (isValidDomain(input)) {
            return setupAxios(data.token)
              .get(`/exists?domain=${input}`)
              .then(() => {
                return true;
              })
              .catch((err) => {
                if (err.response) {
                  return `${err.response.data.msg}`;
                }
                return `${err.message}`;
              });
          } else {
            return `${input} is not a valid domain`;
          }
        },
      },
    ],
  );

  return { name, buildCommand, outputDirectory, domain };
};

export default deploy;
