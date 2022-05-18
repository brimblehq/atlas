import { log } from "@brimble/utils";
import chalk from "chalk";
import { pusherClient, setupAxios } from "./helpers";

const deployLogs = (options: { projectID: string }) => {
  const { projectID } = options;
  if (!projectID) {
    console.error(
      chalk.red(
        `Please provide a project ID use the ${chalk.bold("-pID")} option`
      )
    );
    process.exit(1);
  }
  const channel = pusherClient.subscribe(`${projectID}`);
  console.log(chalk.green(`Listening for logs...`));
  setupAxios()
    .get(`/logs?id=${projectID}`)
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
