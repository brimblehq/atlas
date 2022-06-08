import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import { setupAxios } from "../helpers";

const logout = () => {
  const config = new Conf("brimble");
  const token = config.get("token");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }
  log.info(chalk.green("Logging out..."));

  setupAxios(token)
    .post("/logout")
    .then(() => {
      config.delete("token");
      config.delete("email");
      config.delete("refresh_token");

      log.info(chalk.green("Logged out 🤓"));

      process.exit(0);
    })
    .catch((err) => {
      if (err.response) {
        log.error(chalk.red(`Error logging out 😭\n${err.response.data.msg}`));
      } else {
        log.error(chalk.red(`Error logging out 😭\n${err.message}`));
      }
      process.exit(1);
    });
};

export default logout;
