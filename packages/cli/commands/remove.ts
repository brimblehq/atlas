import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import ora from "ora";
import { setupAxios } from "../helpers";

const remove = (value: string | number) => {
  const config = new Conf("brimble");
  const token = config.get("token");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }
  const spinner = ora(`Removing project and every trace 😅...`).start();

  setupAxios(token)
    .delete(
      `/delete?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`
    )
    .then(({ data }) => {
      config.delete(`${data?.project?.id}`);
      config.delete(`${data?.project?.name}`);
      spinner.succeed(chalk.green(`Project removed 🤓`));

      process.exit(0);
    })
    .catch((err) => {
      if (err.response) {
        spinner.fail(
          chalk.red(
            `Error removing project from Brimble 😭\n${err.response.data.msg}`
          )
        );
      } else if (err.request) {
        spinner.fail(chalk.red(`Make sure you are connected to the internet`));
      } else {
        spinner.fail(
          chalk.red(`Error removing project from Brimble 😭\n${err.message}`)
        );
      }
      process.exit(1);
    });
};

export default remove;
