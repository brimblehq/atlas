import fs from "fs";
import path from "path";
import axios from "axios";
import { Spinner } from "clui";
import chalk from "chalk";
import Pusher, { Channel } from "pusher-js";

const API_URL = process.env.API_URL || "http://brimble.test/api";

const pusher = new Pusher(
  process.env.PUSHER_APP_KEY || "03e3c1878b5dc67cc5c1",
  {
    cluster: "eu",
  }
);

const deploy = async (directory: string = ".", options: { open: boolean }) => {
  process.chdir(directory);
  const folder = process.cwd();
  const files = fs.readdirSync(folder);
  const uniqueSuffix = Math.round(Math.random() * 1e9);

  const channel = pusher.subscribe(`${uniqueSuffix}`);

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
      channel.bind("deployed", (data: any) => {
        spinner.stop();
        console.log(chalk.green("Deployed to Brimble"));
        if (options.open) {
          console.log(chalk.green(`Opening ${data.url}`));
          require("better-opn")(data.url);
        }
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
