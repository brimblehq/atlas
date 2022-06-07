import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import { setupAxios } from "../helpers";

const domains = (value: string | number) => {
  const config = new Conf("brimble");
  const token = config.get("token");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }
  log.info(chalk.green(`Listing domains connected to ${value}`));

  setupAxios(token)
    .get(
      `/domains?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`
    )
    .then(({ data }) => {
      const { domains } = data;
      log.info(chalk.green(`${domains.length} domains found 🤓`));
      domains.forEach(({ name }: { name: string }) => {
        log.info(chalk.green(`${name}`));
      });

      process.exit(0);
    })
    .catch((err) => {
      if (err.response) {
        log.error(
          chalk.red(
            `Error fetching domains from Brimble 😭\n${err.response.data.msg}`
          )
        );
      } else {
        log.error(
          chalk.red(`Error fetching domains from Brimble 😭\n${err.message}`)
        );
      }
      process.exit(1);
    });
};

export default domains;
