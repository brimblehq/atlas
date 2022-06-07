import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import { setupAxios, socket } from "../helpers";

const deployLogs = async (value: string | number) => {
  const config = new Conf("brimble");
  const token = config.get("token");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }
  console.log(chalk.green(`Listening for logs...`));

  setupAxios(token)
    .get(`/logs?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`)
    .then(() => {
      socket.on(
        `${value}-logs`,
        ({ message, error }: { message: string; error: boolean }) => {
          if (error) {
            log.error(message);
            process.exit(1);
          } else {
            log.info(message);
          }
        }
      );
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

export default deployLogs;
