import { detectFramework, log } from "@brimble/utils";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import inquirer from "inquirer";
import isValidDomain from "is-valid-domain";
import path from "path";
import Conf from "configstore";
import forever from "forever-monitor";
import {
  dirValidator,
  getFiles,
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
    const project = config.get(`${options.name || options.projectID}`);
    const projectID = project?.projectID
      ? project?.projectID
      : options.projectID
      ? options.projectID
      : Math.round(Math.random() * 1e9);

    let filesToUpload = project?.changedFiles || getFiles(folder);
    let buildCommand = "";
    let outputDirectory = "";
    const hasPackageJson = files.includes("package.json");

    if (hasPackageJson) {
      filesToUpload = filesToUpload.filter(
        (file: string) =>
          !file.includes("/node_modules") &&
          !file.includes("/build") &&
          !file.includes("/dist") &&
          !file.includes(".git") &&
          !file.includes(".angular/cache") &&
          !file.includes(".next") &&
          !file.includes(".cache")
      );
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
            default: path.basename(folder),
            when: !options.name,
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
          },
        ])
        .then(async (answers) => {
          const { name, buildCommand, outputDirectory, domain } = answers;

          if (domain && !isValidDomain(domain)) {
            throw new Error("Invalid domain");
          }

          log.info(chalk.green(`Uploading ${filesToUpload.length} files...`));

          await sendToServer({
            folder,
            filesToUpload,
            buildCommand,
            outputDirectory,
            projectID,
            name: name ? name : options.name || project.name,
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
      log.info(chalk.green(`Uploading ${filesToUpload.length} files...`));

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
  // start timer
  const upload = async (file: string) => {
    const filePath = path.resolve(folder, file);
    // get directory
    const directory = file.split("/").slice(0, -1).join("/");
    await setupAxios(token)
      .post(
        `/cli/upload`,
        {
          dir: `${projectID}/${directory}`,
          file: fs.createReadStream(filePath),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .catch((err) => {
        log.error(
          chalk.red(
            `Error uploading ${filePath}
              ${chalk.bold(`\n${err.message}`)}
            `
          )
        );
        process.exit(1);
      });
  };

  const start = new Date();
  await Promise.all(filesToUpload.map(upload)).then(() => {
    log.info(chalk.green("All files uploaded"));
  });

  log.info(`Setting up project ${chalk.bold(name)}!!!`);
  setupAxios(token)
    .post(
      `/cook`,
      {
        uuid: projectID,
        dir: folder,
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
      const payload = {
        projectID,
        domain,
        name,
        buildCommand,
        outputDirectory,
        changedFiles: [],
      };
      if (!project) {
        config.set(`${projectID}`, payload);
        config.set(`${name}`, payload);
      } else {
        config.set(`${projectID}`, {
          ...project,
          ...payload,
        });
        config.set(`${name}`, {
          ...project,
          ...payload,
        });
      }

      forever.start(["brimble", "watch", "-pID", `${projectID}`, `${folder}`], {
        max: 1,
        silent: true,
        uid: name,
      });

      if (options.silent) {
        log.warn(chalk.yellow(`Silent mode enabled`));
        log.info(
          chalk.blue(
            `Use ${chalk.bold(`brimble logs ${projectID}`)} to view logs`
          )
        );
        process.exit(0);
      } else {
        log.info(
          chalk.yellow(
            `This might take a minute, please wait until the project is ready or use ${chalk.bold(
              `brimble logs ${projectID}`
            )} to view logs`
          )
        );
      }

      socket.on(
        `${projectID}-deployed`,
        ({ url, message }: { url: string; message: string }) => {
          log.info(chalk.green("Deployed to Brimble 🎉"));
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
          const time = msToTime(end.getTime() - start.getTime());
          log.info(chalk.green(`Time to deploy: ${chalk.bold(`${time}`)}`));

          process.exit(0);
        }
      );

      socket.on(`${projectID}-error`, ({ message }: { message: string }) => {
        log.error(chalk.red(`Error deploying to Brimble 😭\n${message}`));
        process.exit(1);
      });
    })
    .catch((err) => {
      if (err.response) {
        log.error(
          chalk.red(`Error deploying to Brimble 😭\n${err.response.data.msg}`)
        );
      } else {
        log.error(chalk.red(`Error deploying to Brimble 😭\n${err.message}`));
      }
      process.exit(1);
    });
};

export default deploy;
