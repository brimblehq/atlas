import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
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
    log.info(chalk.green("Getting user info..."));

    setupAxios(token)
      .get(`/auth/whoami`)
      .then(({ data }) => {
        const { email } = data.data;
        log.info(chalk.green(`Logged in as ${chalk.bold(email)}`));
        config.set("email", email);

        process.exit(0);
      })
      .catch((err) => {
        if (err.response) {
          log.error(
            chalk.red(
              `Error getting logged in user 😭\n${err.response.data.message}`
            )
          );
        } else {
          log.error(
            chalk.red(`Error getting logged in user 😭\n${err.message}`)
          );
        }
        process.exit(1);
      });
  }
};

export default whoami;
