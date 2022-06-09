import { log } from "@brimble/utils";
import chalk from "chalk";
import { Command } from "commander";
import Conf from "configstore";
import isValidDomain from "is-valid-domain";
import { setupAxios } from "../helpers";

const domains = (
  value: string,
  options: { projectID: number; name: string },
  command: Command
) => {
  const config = new Conf("brimble");
  const token = config.get("token");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }
  if (command.name() === "list") {
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
        console.log(err.response);
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
  } else if (command.name() === "add") {
    if (!isValidDomain(value)) {
      log.error(chalk.red("Invalid domain"));
      process.exit(1);
    }

    if (!options.name && !options.projectID) {
      log.error(chalk.red("You must specify a project name or id"));
      process.exit(1);
    }

    const project = config.get(`${options.name || options.projectID}`);
    if (!project) {
      log.error(chalk.red("You must create a project first"));
      process.exit(1);
    }
    log.info(chalk.green(`Adding domain ${value} to ${project.name}`));

    setupAxios(token)
      .post(`/domains`, {
        domain: value,
        projectId: project.projectID,
      })
      .then(({ data }) => {
        const { domain } = data;
        log.info(chalk.green(`${domain.name} added 🤓`));
        process.exit(0);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response) {
          log.error(
            chalk.red(
              `Error adding domain to Brimble 😭\n${err.response.data.msg}`
            )
          );
        } else {
          log.error(
            chalk.red(`Error adding domain to Brimble 😭\n${err.message}`)
          );
        }
        process.exit(1);
      });
  }
};

export default domains;
