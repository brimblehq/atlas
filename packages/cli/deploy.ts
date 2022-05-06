import fs from "fs";
import path from "path";
import axios from "axios";
import { Spinner } from "clui";
import chalk from "chalk";
import { Channel } from "pusher-js";

const API_URL = process.env.API_URL || "http://brimble.test/api";

const deploy = async (
  directory: string = ".",
  options: { open: boolean },
  channel: Channel
) => {
  process.chdir(directory);
  const folder = process.cwd();
  const files = fs.readdirSync(folder);
  const uniqueSuffix = Math.round(Math.random() * 1e9);

  const index = files.find((file) => file.endsWith("index.html"));
  if (!index) {
    throw new Error("No index.html found");
  }

  // check if file is a directory and return all files in it with previous directory
  const getFiles = (file: string, previous: string = "") => {
    const filePath = path.resolve(previous, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      return fs.readdirSync(filePath).reduce((acc, file): any => {
        return [...acc, ...getFiles(file, filePath)];
      }, []);
    }
    return [filePath];
  };

  const filesToUpload = getFiles(folder);

  const spinner = new Spinner(
    `Uploading ${chalk.green(filesToUpload.length)} files to ${chalk.green(
      `Brimble`
    )}\n`,
    ["🥳", "😃", "🙂", "😝", "🤩", "😎", "🤓", "😁", "😂"]
  );

  spinner.start();

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
        console.error(
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
    console.log(chalk.green("All files uploaded"));
  });

  spinner.message(`Deploying to ${chalk.green(`Brimble`)}`);

  await axios
    .post(
      `${API_URL}/cook`,
      {
        uniqueId: uniqueSuffix,
        dir: folder,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(() => {
      channel.bind(`${uniqueSuffix}`, (data: any) => {
        spinner.stop();
        // break into lines
        const lines = data.message.split("\n");
        // print each line
        lines.forEach((line: string) => {
          // check if there is a link
          if (line.includes("http")) {
            if (options.open) {
              const link = line.split(" ")[3];
              require("better-opn")(link);
            }
          }
          console.log(line);
        });
        process.exit(0);
      });
    })
    .catch((err) => {
      console.error(
        chalk.red(`Error deploying to${chalk.green(`Brimble`)}`),
        err
      );
      process.exit(1);
    });
};

export default deploy;
