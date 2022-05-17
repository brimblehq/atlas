import fs from "fs";
import path from "path";
import axios from "axios";
import chalk from "chalk";
import Pusher from "pusher-js";
import dotenv from "dotenv";
import { log } from "@brimble/utils";
import isValidDomain from "is-valid-domain";
import { dirValidator, getFiles } from "./helpers";

dotenv.config();

const API_URL = process.env.API_URL || "https://bookily.xyz/api";

const pusher = new Pusher(
  process.env.PUSHER_APP_KEY || "03e3c1878b5dc67cc5c1",
  {
    cluster: "eu",
  }
);

const deploy = async (
  directory: string = ".",
  options: { open: boolean; domain: string }
) => {
  try {
    const { folder, files } = dirValidator(directory);
    const uniqueSuffix = Math.round(Math.random() * 1e9);

    const channel = pusher.subscribe(`${uniqueSuffix}`);

    if (options.domain && !isValidDomain(options.domain)) {
      throw new Error("Invalid domain");
    }

    let filesToUpload = getFiles(folder);

    if (files.includes("package.json")) {
      filesToUpload = filesToUpload.filter(
        (file) =>
          !file.includes("node_modules") &&
          !file.includes("build") &&
          !file.includes("dist") &&
          !file.includes(".git")
      );
    }

    log.info(chalk.green(`Uploading ${filesToUpload.length} files...`));

    const upload = async (file: string) => {
      const filePath = path.resolve(folder, file);
      // get directory
      const directory = file.split("/").slice(0, -1).join("/");
      await axios
        .post(
          `${API_URL}/cli/upload`,
          {
            dir: `${uniqueSuffix}/${directory}`,
            file: fs.createReadStream(filePath),
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .catch((err) => {
          console.log({ err });
          log.error(
            chalk.red(
              `Error uploading ${filePath} to ${chalk.green(`${API_URL}`)}
              ${chalk.bold(`\n${err.message}`)}
            `
            )
          );
          process.exit(1);
        });
    };

    await Promise.all(filesToUpload.map(upload)).then(() => {
      log.info(chalk.green("All files uploaded"));
    });

    log.info(`Deploying to ${chalk.green(`Brimble`)}...`);

    await axios
      .post(
        `${API_URL}/cook`,
        {
          uniqueId: uniqueSuffix,
          dir: folder,
          domain: options.domain,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        channel.bind("deploying", ({ message }: { message: string }) => {
          log.info(message);
        });

        channel.bind(
          "deployed",
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
            process.exit(0);
          }
        );

        channel.bind("error", ({ message }: { message: string }) => {
          log.error(chalk.red(`Error deploying to Brimble 😭\n${message}`));
          process.exit(1);
        });
      })
      .catch((err) => {
        console.log({ err });
        if (err.response) {
          log.error(
            chalk.red(`Error deploying to Brimble 😭\n${err.response.data.msg}`)
          );
        } else {
          log.error(chalk.red(`Error deploying to Brimble 😭\n${err.message}`));
        }
        process.exit(1);
      });
  } catch (err) {
    const { message } = err as Error;
    log.error(chalk.red(`Error deploying to Brimble 😭\n${message}`));
    process.exit(1);
  }
};

export default deploy;
