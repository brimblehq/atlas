import { log } from "@brimble/utils";
import chalk from "chalk";
import ora from "ora";
import { FEEDBACK_MESSAGE, isLoggedIn, setupAxios } from "../helpers";

const list = () => {
  const user = isLoggedIn();
  if (!user) {
    log.error(chalk.red("You are not logged in"));
    process.exit(1);
  }

  const spinner = ora(`Listing project belonging to you`).start();

  setupAxios(user.token)
    .get(`/projects`)
    .then(({ data }) => {
      const { projects } = data;
      spinner.succeed(chalk.green(`${projects?.length} projects found 🤓`));
      projects.forEach(
        (project: {
          name: string;
          projectID: number;
          buildCommand: string;
          outputDirectory: string;
        }) => {
          log.info(chalk.green(`${project.name}`));
        }
      );
      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(0);
    })
    .catch((err) => {
      if (err.response) {
        spinner.fail(
          chalk.red(
            `Error fetching projects from Brimble 😭\n${err.response.data.msg}`
          )
        );
      } else if (err.request) {
        spinner.fail(chalk.red(`Make sure you are connected to the internet`));
      } else {
        spinner.fail(
          chalk.red(`Error fetching projects from Brimble 😭\n${err.message}`)
        );
      }
      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(1);
    });
};

export default list;
