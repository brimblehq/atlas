import { log } from "@brimble/utils";
import chalk from "chalk";
import { redisClient, setupAxios } from "../helpers";

const deployLogs = async (value: string | number) => {
  const { subscriber } = await redisClient();
  console.log(chalk.green(`Listening for logs...`));

  setupAxios()
    .get(`/logs?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`)
    .then(() => {
      subscriber.subscribe(`private-${value}-logs`, (data: string) => {
        const { message } = JSON.parse(data);
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
