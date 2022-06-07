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

  config.delete("token");

  log.info(chalk.green("Logged out 🤓"));

  process.exit(0);
};

export default logout;
