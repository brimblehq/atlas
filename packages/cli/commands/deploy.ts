import { detectFramework, log } from "@brimble/utils";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import inquirer from "inquirer";
import isValidDomain from "is-valid-domain";
import path from "path";
import Conf from "configstore";
import forever from "forever-monitor";
import ora from "ora";
import slugify from "slugify";
import {
  dirValidator,
  FEEDBACK_MESSAGE,
  getFiles,
  getIgnoredFiles,
  msToTime,
  setupAxios,
  socket,
} from "../helpers";

dotenv.config();

const config = new Conf("brimble");

const deploy = async (
  directory: string = ".",
  options: {
    open: boolean;
    domain: string;
    projectID: string;
    silent: boolean;
    name: string;
  } = {
    open: false,
    domain: "",
    projectID: "",
    silent: false,
    name: "",
  }
) => {
  try {
    const token = config.get("token");
    if (!token) {
      log.error(chalk.red("You must login first"));
      process.exit(1);
    }
    const { folder, files } = dirValidator(directory);
    const project = config.get(`${options.name}`);
    const projectID = project?.projectID
      ? project.projectID
      : options.projectID
      ? options.projectID
      : Math.round(Math.random() * 1e9);

    let filesToUpload = project?.filesToUpload?.length
      ? project.filesToUpload
      : project?.changedFiles
      ? project.changedFiles
      : getFiles(folder);
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

    if (!project) {
      inquirer
        .prompt([
          {
            name: "name",
            message: "Name of the project",
            default: slugify(path.basename(folder), { lower: true }),
            when: !options.name,
            validate: (input: string) => {
              if (!input) {
                return "Please enter a project name";
              } else if (config.get(input)) {
                return true;
              } else {
                return setupAxios(token)
                  .get(`/exists?name=${slugify(input, { lower: true })}`)
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
            validate: (input: string, answers: any) => {
              if (isValidDomain(input)) {
                const project = config.get(answers.name);
                if (project && project.domains?.includes(input)) {
                  return true;
                } else {
                  return setupAxios(token)
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
                }
              } else {
                return `${input} is not a valid domain`;
              }
            },
          },
        ])
        .then(async (answers) => {
          const { name, buildCommand, outputDirectory, domain } = answers;

          await sendToServer({
            folder,
            filesToUpload,
            buildCommand,
            outputDirectory,
            projectID: config.get(name)?.projectID || projectID,
            name: slugify(name || options.name, { lower: true }),
            domain,
            options,
            token,
            project,
          });
        })
        .catch((err) => {
          console.error(chalk.red(err));
          process.exit(1);
        });
    } else {
      await sendToServer({
        folder,
        filesToUpload,
        buildCommand: project.buildCommand || buildCommand,
        outputDirectory: project.outputDirectory || outputDirectory,
        projectID,
        name: options.name || project.name,
        domain: options.domain || project.domain,
        options,
        token,
        project,
      });
    }
  } catch (err) {
    const { message } = err as Error;
    log.error(chalk.red(`Error deploying to Brimble 😭\n${message}`));
    process.exit(1);
  }
};

const sendToServer = async ({
  folder,
  projectID,
  filesToUpload,
  domain,
  name,
  buildCommand,
  outputDirectory,
  options,
  token,
  project,
}: {
  folder: string;
  projectID: number;
  filesToUpload: string[];
  domain: string;
  name: string;
  buildCommand: string;
  outputDirectory: string;
  options: {
    open: boolean;
    silent: boolean;
  };
  token: string;
  project: any;
}) => {
  const payload = {
    projectID,
    name,
    filesToUpload,
  };

  const uploadSpinner = ora(
    chalk.green(`Uploading ${filesToUpload.length} files...`)
  ).start();

  config.set(`${name}`, !project ? payload : { ...project, ...payload });

  const upload = async (file: string) => {
    const filePath = path.resolve(folder, file);
    // get directory
    const directory = file.split("/").slice(0, -1).join("/");

    const useRootDir = directory.split(`${path.basename(folder)}/`);
    useRootDir.shift();
    const rootDir = `${path.basename(folder)}/${useRootDir.join("")}`;

    await setupAxios(token)
      .post(
        `/cli/upload`,
        {
          dir: `${projectID}/${rootDir}`,
          file: fs.createReadStream(filePath),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        const filesLeft = filesToUpload.filter((f: string) => f !== file);
        config.set(`${name}`, {
          ...payload,
          filesToUpload: filesLeft,
        });
      })
      .catch((err) => {
        if (err.response) {
          log.error(
            chalk.red(
              `Error uploading ${filePath}
              ${chalk.bold(`\n${err.response.data.msg}`)}
            `
            )
          );
        } else if (err.request) {
          log.error(
            chalk.red(
              `Error uploading ${filePath}
              \n Make sure you have a good internet connection
              `
            )
          );
        } else {
          log.error(chalk.red(`Error uploading ${filePath} \n${err.message}`));
        }

        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(1);
      });
  };

  const uploadTime = new Date();
  await Promise.all(filesToUpload.map(upload)).then(() => {
    uploadSpinner.succeed(
      chalk.green(
        `Uploaded ${filesToUpload.length} files in ${
          new Date().getTime() - uploadTime.getTime()
        }ms`
      )
    );
  });

  const deploySpinner = ora(`Setting up project ${chalk.bold(name)}`).start();

  const deployTime = new Date();
  setupAxios(token)
    .post(
      `/cook`,
      {
        uuid: projectID,
        dir: path.basename(folder),
        domain,
        name,
        buildCommand,
        outputDirectory,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(() => {
      config.set(`${name}`, {
        projectID,
        name,
        buildCommand,
        outputDirectory,
        changedFiles: [],
        filesToUpload: [],
      });

      if (process.platform === "win32") {
        const spawn = require("cross-spawn");
        spawn.sync(
          "npx",
          [
            "forever",
            "start",
            "--append",
            "--uid",
            name,
            path.join("../dist/index.js"),
            "watch",
            "-pID",
            `${projectID}`,
            `${folder}`,
          ],
          { stdio: "inherit", detached: true }
        );
      } else {
        forever.start(
          ["brimble", "watch", "-pID", `${projectID}`, `${folder}`],
          {
            max: 1,
            silent: true,
            uid: name,
          }
        );
      }

      if (options.silent) {
        log.warn(chalk.yellow(`Silent mode enabled`));
        log.info(
          chalk.blue(`Use ${chalk.bold(`brimble logs ${name}`)} to view logs`)
        );
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(0);
      } else {
        deploySpinner.color = "yellow";
        deploySpinner.text = chalk.yellow(
          `This might take a minute, please wait until the project is ready or use ${chalk.bold(
            `brimble logs ${name}`
          )} to view logs`
        );
      }

      socket.on(
        `${projectID}-deployed`,
        ({ url, message }: { url: string; message: string }) => {
          deploySpinner.succeed(chalk.green(`Project deployed to Brimble 🎉`));
          if (message) {
            log.warn(chalk.yellow.bold(`${message}`));
          }
          if (options.open) {
            log.info(chalk.green(`Opening ${url}`));
            require("better-opn")(url);
          } else {
            log.info(chalk.green(`Your site is available at ${url}`));
          }

          log.info(
            chalk.yellow(
              `Use ${chalk.bold(`brimble cook -n ${name}`)} to deploy again`
            )
          );

          // end execution time
          const end = new Date();

          // calculate execution time
          const time = msToTime(end.getTime() - deployTime.getTime());
          log.info(chalk.green(`Time to deploy: ${chalk.bold(`${time}`)}`));

          log.info(chalk.greenBright(FEEDBACK_MESSAGE));

          process.exit(0);
        }
      );

      socket.on(`${projectID}-error`, ({ message }: { message: string }) => {
        deploySpinner.fail(chalk.red(`Project failed to deploy 🚨`));
        log.error(
          chalk.red(`${message} Using ${chalk.bold(`brimble logs ${name}`)}`)
        );
        process.exit(1);
      });
    })
    .catch((err) => {
      if (err.response) {
        deploySpinner.fail(
          chalk.red(`Error deploying to Brimble 😭\n${err.response.data.msg}`)
        );
      } else if (err.request) {
        deploySpinner.fail(
          chalk.red(`Make sure you are connected to the internet`)
        );
      } else {
        deploySpinner.fail(
          chalk.red(`Error deploying to Brimble 😭 \n ${err.message}`)
        );
      }
      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(1);
    });
};

export default deploy;
