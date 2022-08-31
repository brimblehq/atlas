import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import ora from "ora";
import { FEEDBACK_MESSAGE, isLoggedIn, setupAxios } from "../helpers";

const logout = () => {
  const config = new Conf("brimble");
  const user = isLoggedIn();
  if (!user) {
    log.error(chalk.red("You are not logged in"));
    process.exit(1);
  }
  const spinner = ora("Logging out from Brimble cloud").start();

  setupAxios(user.token)
    .post("/logout")
    .then(() => {
      config.delete("user");
      spinner.succeed(chalk.green("You are now logged out"));
      log.info(chalk.green("See you next time!"));

      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(0);
    })
    .catch((err) => {
      if (err.response) {
        spinner.fail(
          chalk.red(`Error logging out 😭\n${err.response.data.msg}`)
        );
      } else if (err.request) {
        spinner.fail(chalk.red(`Make sure you are connected to the internet`));
      } else {
        spinner.fail(chalk.red(`Error logging out 😭\n${err.message}`));
      }
      log.info(chalk.greenBright(FEEDBACK_MESSAGE));
      process.exit(1);
    });
};

export default logout;
