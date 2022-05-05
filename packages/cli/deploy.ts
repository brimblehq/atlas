import fs from "fs";
import path from "path";
import axios from "axios";
import { Spinner } from "clui";
import chalk from "chalk";

const deploy = async (directory: string = ".", options: { open: boolean }) => {
  process.chdir(directory);
  const folder = process.cwd();
  const files = fs.readdirSync(folder);

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
      `${options.open ? "http://localhost:3000" : "https://brimble.app"}`
    )}\n`
  );

  spinner.start();

  const upload = async (file: string) => {
    const filePath = path.resolve(folder, file);
    // get directory
    const directory = file.split("/").slice(0, -1).join("/");
    await axios
      .post(
        "http://127.0.0.1:3000/api/upload",
        {
          file: fs.createReadStream(filePath),
          dir: directory,
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
            `Error uploading ${filePath} to${chalk.green(
              `${
                options.open ? "http://localhost:3000" : "https://brimble.app"
              }`
            )}`
          )
        );
        process.exit(1);
      });
  };

  await Promise.all(filesToUpload.map(upload)).then(() => {
    console.log(chalk.green("All files uploaded"));
  });

  spinner.stop();
};

export default deploy;
