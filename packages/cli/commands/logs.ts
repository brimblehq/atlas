import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import ora from "ora";
import { setupAxios, socket } from "../helpers";

const deployLogs = async (value: string | number) => {
  const config = new Conf("brimble");
  const token = config.get("token");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }
  const spinner = ora(`Fetching logs for ${value}`).start();

  setupAxios(token)
    .get(`/logs?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`)
    .then(() => {
      socket.on(
        `${value}-logs`,
        ({ message, error }: { message: string; error: boolean }) => {
          if (error) {
            spinner.fail(message);
            process.exit(1);
          } else {
            spinner.stop();
            log.info(message);
          }
        }
      );
    })
    .catch((err) => {
      if (err.response) {
        spinner.fail(
          chalk.red(`Error deploying to Brimble 😭\n${err.response.data.msg}`)
        );
      } else if (err.request) {
        spinner.fail(chalk.red(`Make sure you are connected to the internet`));
      } else {
        spinner.fail(
          chalk.red(`Error deploying to Brimble 😭\n${err.message}`)
        );
      }
      process.exit(1);
    });
};

export default deployLogs;
