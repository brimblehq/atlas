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

const deploy = async (
  directory: string = ".",
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
  }
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
      buildCommand = framework.settings.buildCommand;
      outputDirectory = framework.settings.outputDirectory || "dist";
    }

    if (!proj || !proj.id) {
      if (!options.projectID || !config.get(options.projectID)) {
        const { createProject } = await inquirer.prompt([
          {
            type: "confirm",
            name: "createProject",
            message: "Initialize project?",
            default: true,
          },
        ]);

        if (!createProject) {
          log.warn("Project not initialized");
          process.exit(1);
        }

        const oauth = config.get("oauth");
        const hasGit = await git.revparse(["--is-inside-work-tree"]);

        if (
          oauth &&
          (oauth.toUpperCase() === GIT_TYPE.GITHUB ||
            oauth.toUpperCase() === GIT_TYPE.GITLAB ||
            oauth.toUpperCase() === GIT_TYPE.BITBUCKET) &&
          hasGit
        ) {
          const spinner = ora("Searching for repositories").start();

          const listRepos = async (repos: any[]) => {
            const { repo } = await inquirer.prompt([
              {
                type: "list",
                name: "repo",
                message: "Select a repository",
                choices: [
                  ...repos?.map((repo: any) => ({
                    name: repo.name,
                    value: {
                      id: repo.id,
                      name: repo.name,
                      full_name: repo.full_name,
                    },
                  })),
                  {
                    name: "Not listed? Add it",
                    value: null,
                  },
                ],
              },
            ]);

            if (repo === null) {
              open(`https://github.com/apps/brimble-build/installations/new`);
              spinner.start("Awaiting installation");
              socket.on(`${config.get("id")}:repos`, async (repos: any) => {
                spinner.stop();
                await listRepos(repos);
              });
            } else {
              const remoteRepo = await git.getConfig("remote.origin.url");
              if (remoteRepo && !remoteRepo.value?.includes(repo.full_name)) {
                const { changeRemote } = await inquirer.prompt([
                  {
                    type: "confirm",
                    name: "changeRemote",
                    message: "Change remote repository?",
                    default: true,
                  },
                ]);
                if (changeRemote) {
                  open(
                    `https://github.com/apps/brimble-build/installations/new`
                  );
                  spinner.start("Awaiting installation");
                  socket.on(`${config.get("id")}:repos`, async (repos: any) => {
                    spinner.stop();
                    await listRepos(repos);
                  });
                } else {
                  process.exit(1);
                }
              } else {
                inquirer
                  .prompt([
                    {
                      name: "name",
                      message: "Name of the project",
                      default: slugify(path.basename(folder), {
                        lower: true,
                      }),
                      when: !options.name,
                      validate: (input: string) => {
                        if (!input) {
                          return "Please enter a project name";
                        } else {
                          return setupAxios(user.token)
                            .get(
                              `/exists?name=${slugify(input, {
                                lower: true,
                              })}`
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
                      default: buildCommand,
                      when: hasPackageJson,
                    },
                    {
                      name: "outputDirectory",
                      message: "Output directory",
                      default: outputDirectory,
                      when: hasPackageJson,
                    },
                    {
                      name: "domain",
                      message: "Domain name",
                      default: options.name
                        ? `${options.name}.brimble.app`
                        : ({ name }: { name: string }) => {
                            return name ? `${name}.brimble.app` : "";
                          },
                      when: !options.domain,
                      validate: (input: string) => {
                        if (isValidDomain(input)) {
                          return setupAxios(user.token)
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
                  ])
                  .then(async (answers) => {
                    const { name, buildCommand, outputDirectory, domain } =
                      answers;

                    if (createProject) {
                      setupAxios(user.token)
                        .post(`/init`, {
                          name: slugify(name, { lower: true }),
                          repo,
                        })
                        .then(async ({ data }) => {
                          projectConf.set("project", {
                            id: data.projectId,
                          });
                          await sendToServer({
                            folder,
                            filesToUpload,
                            buildCommand,
                            outputDirectory,
                            projectId: data.projectId,
                            name: slugify(name || options.name, {
                              lower: true,
                            }),
                            domain,
                            options,
                            token: user.token,
                          });
                        })
                        .catch((err) => {
                          const { response } = err;
                          if (response) {
                            log.error(response.data.msg);
                          } else {
                            log.error(err.message);
                          }
                          process.exit(1);
                        });
                    }
                  });
              }
            }
          };

          setupAxios(user.token)
            .get(`/repos/${oauth.toLowerCase()}`)
            .then(async ({ data }) => {
              spinner.stop();

              await listRepos(data.data);
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
                    `https://github.com/apps/brimble-build/installations/new`
                  );
                  spinner.start("Awaiting installation");
                  socket.on(`${config.get("id")}:repos`, async (repos: any) => {
                    spinner.stop();
                    await listRepos(repos);
                  });
                } else {
                  process.exit(1);
                }
              } else if (err.request) {
                spinner.fail("Please check your internet connection");
              } else {
                spinner.fail("Failed with unknown error " + err.message);
              }
            });
        } else {
          log.error(chalk.red("You must initialize a git repository first"));
          process.exit(1);
        }
      } else {
        const project = config.get(options.projectID);
        projectConf.set("project", { id: options.projectID });

        filesToUpload = project?.filesToUpload?.length
          ? project.filesToUpload
          : project?.changedFiles || filesToUpload;

        await sendToServer({
          folder,
          filesToUpload,
          buildCommand: project.buildCommand || buildCommand,
          outputDirectory: project.outputDirectory || outputDirectory,
          projectId: +options.projectID,
          name: options.name || project.name,
          domain: options.domain,
          options,
          token: user.token,
        });
      }
    } else {
      const project = config.get(`${proj.id}`);
      if (!project) {
        log.error(chalk.red("Project not found"));
        process.exit(1);
      }

      filesToUpload = project?.filesToUpload?.length
        ? project.filesToUpload
        : project?.changedFiles || filesToUpload;

      await sendToServer({
        folder,
        filesToUpload,
        buildCommand: project.buildCommand || buildCommand,
        outputDirectory: project.outputDirectory || outputDirectory,
        projectId: proj.id,
        name: options.name || project.name,
        domain: options.domain,
        options,
        token: user.token,
      });
    }
  } catch (err) {
    const { message } = err as Error;
    log.error(chalk.red(`Error deploying to Brimble 😭\n${message}`));
    process.exit(1);
  }
};

export default deploy;
