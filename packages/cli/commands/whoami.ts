import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import ora from "ora";
import { setupAxios } from "../helpers";

const whoami = () => {
  const config = new Conf("brimble");
  const token = config.get("token");
  const email = config.get("email");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }
  if (email) {
    log.info(chalk.green(`Logged in as ${chalk.bold(email)}`));

    process.exit(0);
  } else {
    const spinner = ora("Fetching user info...").start();

    setupAxios(token)
      .get(`/auth/whoami`)
      .then(({ data }) => {
        const { email } = data.data;
        config.set("email", email);
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
