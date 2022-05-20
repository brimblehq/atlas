import { log } from "@brimble/utils";
import chalk from "chalk";
import { pusherClient, setupAxios } from "./helpers";

const deployLogs = (value: string | number) => {
  const channel = pusherClient.subscribe(`${value}`);
  console.log(chalk.green(`Listening for logs...`));

  setupAxios()
    .get(`/logs?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`)
    .then(() => {
      channel.bind("logs", ({ message }: { message: string }) => {
        log.info(message);
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

export default deployLogs;
