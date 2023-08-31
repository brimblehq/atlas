import { log } from "@brimble/utils";
import chalk from "chalk";
import ora from "ora";
import {
  FEEDBACK_MESSAGE,
  isLoggedIn,
  projectConfig,
  setupAxios,
} from "../helpers";

const remove = async () => {
  const user = isLoggedIn();
  if (!user) {
    log.error(chalk.red("You are not logged in"));
    process.exit(1);
  }

  const projectConf = await projectConfig();
  const project = projectConf.get("project");
  const id = project.id;

  if (!project || !id) {
    log.error(chalk.red("You must create a project first"));
    process.exit(1);
  }

  const spinner = ora(`Removing project and every trace 😅...`).start();

  setupAxios(user.token)
    .delete(`/delete?id=${id}`)
    .then(({ data }) => {
      projectConf.delete("project");
      spinner.succeed(chalk.green(`Project removed 🤓`));

      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(0);
    })
    .catch((err) => {
      if (err.response) {
        spinner.fail(
          chalk.red(
            `Error removing project from Brimble 😭\n${err.response.data.msg}`,
          ),
        );
      } else if (err.request) {
        spinner.fail(chalk.red(`Make sure you are connected to the internet`));
      } else {
        spinner.fail(
          chalk.red(`Error removing project from Brimble 😭\n${err.message}`),
        );
      }

      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(1);
    });
};

export default remove;
