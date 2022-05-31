import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import { setupAxios } from "./helpers";

const remove = (value: string | number) => {
  const config = new Conf("brimble");
  console.log(chalk.green(`Removing project and every trace 😅...`));

  setupAxios()
    .delete(
      `/delete?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`
    )
    .then(({ data }) => {
      config.delete(`${data?.project?.id}`);
      config.delete(`${data?.project?.name}`);
      log.info(chalk.green(`Project deleted successfully!`));

      process.exit(0);
    })
    .catch((err) => {
      if (err.response) {
        log.error(
          chalk.red(
            `Error removing project from Brimble 😭\n${err.response.data.msg}`
          )
        );
      } else {
        log.error(
          chalk.red(`Error removing project from Brimble 😭\n${err.message}`)
        );
      }
      process.exit(1);
    });
};

export default remove;
