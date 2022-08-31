import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import ora from "ora";
import { FEEDBACK_MESSAGE, isLoggedIn, setupAxios } from "../helpers";

const whoami = () => {
  const config = new Conf("brimble");
  const user = isLoggedIn();
  if (!user) {
    log.error(chalk.red("You are not logged in"));
    process.exit(1);
  }
  if (user.email) {
    log.info(chalk.green(`Logged in as ${chalk.bold(user.email)}`));

    log.info(chalk.greenBright(`${FEEDBACK_MESSAGE}`));

    process.exit(0);
  } else {
    const spinner = ora("Fetching user info...").start();

    setupAxios(user.token)
      .get(`/auth/whoami`)
      .then(({ data }) => {
        const { email } = data.data;
        config.set("user", { ...user, email });
        spinner.succeed(chalk.green(`Logged in as ${chalk.bold(email)}`));

        process.exit(0);
      })
      .catch((err) => {
        if (err.response) {
          spinner.fail(
            chalk.red(
              `Error getting logged in user 😭\n${err.response.data.message}`
            )
          );
        } else if (err.request) {
          spinner.fail(
            chalk.red(`Make sure you are connected to the internet`)
          );
        } else {
          spinner.fail(
            chalk.red(`Error getting logged in user 😭\n${err.message}`)
          );
        }
        process.exit(1);
      });
  }
};

export default whoami;
