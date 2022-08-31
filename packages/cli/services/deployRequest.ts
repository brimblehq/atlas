import { log } from "@brimble/utils";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import forever from "forever-monitor";
import { createReadStream } from "fs";
import Conf from "configstore";
import { FEEDBACK_MESSAGE, msToTime, setupAxios, socket } from "../helpers";

export const sendToServer = async ({
  folder,
  projectId,
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
  projectId: number;
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
  const config = new Conf("brimble");

  const payload = {
    name,
    filesToUpload,
  };

  const uploadSpinner = ora(
    chalk.green(`Uploading ${filesToUpload.length} files...`)
  ).start();

  config.set(`${projectId}`, !project ? payload : { ...project, ...payload });

  const upload = async (file: string) => {
    const filePath = path.resolve(folder, file);
    // get directory
    const directory = file.split("/").slice(0, -1).join("/");

    await setupAxios(token)
      .post(
        `/cli/upload`,
        {
          dir: `${projectId}/${directory}`,
          file: createReadStream(filePath),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        const filesLeft = filesToUpload.filter((f: string) => f !== file);
        config.set(`${projectId}`, { ...payload, filesToUpload: filesLeft });
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
        uuid: projectId,
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
      config.set(`${projectId}`, {
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
            `${projectId}`,
            `${folder}`,
          ],
          { stdio: "inherit", detached: true }
        );
      } else {
        forever.start(
          ["brimble", "watch", "-pID", `${projectId}`, `${folder}`],
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
        `${projectId}-deployed`,
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

      socket.on(`${projectId}-error`, ({ message }: { message: string }) => {
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
