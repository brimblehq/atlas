import { log } from "@brimble/utils";
import chalk from "chalk";
import ora from "ora";
import {
  FEEDBACK_MESSAGE,
  isLoggedIn,
  projectConfig,
  setupAxios,
  socket,
} from "../helpers";

const deployLogs = async () => {
  const user = isLoggedIn();
  if (!user) {
    log.error(chalk.red("You are not logged in"));
    process.exit(1);
  }

  const projectConf = await projectConfig();
  const project = projectConf.get("project");

  if (!project || !project.id) {
    log.error(chalk.red("Create a project"));
    process.exit(1);
  }

  const id = project.id;

  const spinner = ora(`Fetching logs for ${id}`).start();

  setupAxios(user.token)
    .get(`/logs?id=${id}`)
    .then(() => {
      socket.on(
        `${id}-logs`,
        ({ message, error }: { message: string; error: boolean }) => {
          if (error) {
            spinner.fail(message);
            log.info(chalk.greenBright(FEEDBACK_MESSAGE));
            process.exit(1);
          } else {
            spinner.stop();
            log.info(message);
          }
        },
      );
    })
    .catch((err) => {
      if (err.response) {
        spinner.fail(
          chalk.red(`Error viewing log 😭\n${err.response.data.msg}`),
        );
      } else if (err.request) {
        spinner.fail(chalk.red(`Make sure you are connected to the internet`));
      } else {
        spinner.fail(chalk.red(`Error viewing log 😭\n${err.message}`));
      }

      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(1);
    });
};

export default deployLogs;
