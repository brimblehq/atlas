import { log } from "@brimble/utils";
import chalk from "chalk";
import { Command } from "commander";
import Conf from "configstore";
import isValidDomain from "is-valid-domain";
import ora from "ora";
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
    const spinner = ora(`Listing domains connected to ${value}`).start();

    setupAxios(token)
      .get(
        `/domains?${isNaN(parseInt(value.toString())) ? "name" : "id"}=${value}`
      )
      .then(({ data }) => {
        const { domains } = data;
        spinner.succeed(chalk.green(`${domains.length} domains found 🤓`));
        domains.forEach(({ name }: { name: string }) => {
          log.info(chalk.green(`${name}`));
        });

        process.exit(0);
      })
      .catch((err) => {
        if (err.response) {
          spinner.fail(
            chalk.red(
              `Error fetching domains from Brimble 😭\n${err.response.data.msg}`
            )
          );
        } else if (err.request) {
          spinner.fail(
            chalk.red(`Make sure you are connected to the internet`)
          );
        } else {
          spinner.fail(
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
    const spinner = ora(`Adding domain ${value} to ${project.name}`).start();

    setupAxios(token)
      .post(`/domains`, {
        domain: value,
        projectId: project.projectID,
      })
      .then(({ data }) => {
        const { domain, info } = data;
        if (info) {
          log.warn(chalk.yellow(`${info}`));
        }
        spinner.succeed(chalk.green(`${domain} added to ${project.name} 🤓`));
        process.exit(0);
      })
      .catch((err) => {
        if (err.response) {
          spinner.fail(
            chalk.red(
              `Error adding domain to Brimble 😭\n${err.response.data.msg}`
            )
          );
        } else if (err.request) {
          spinner.fail(
            chalk.red(`Make sure you are connected to the internet`)
          );
        } else {
          spinner.fail(
            chalk.red(`Error adding domain to Brimble 😭\n${err.message}`)
          );
        }
        process.exit(1);
      });
  } else if (command.name() === "remove") {
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

    const spinner = ora(
      `Removing domain ${value} from ${project.name}`
    ).start();

    setupAxios(token)
      .delete(`/domains?domain=${value}&projectId=${project.projectID}`)
      .then(() => {
        spinner.succeed(
          chalk.green(`${value} removed from ${project.name} 🤓`)
        );
        process.exit(0);
      })
      .catch((err) => {
        if (err.response) {
          spinner.fail(
            chalk.red(
              `Error removing domain from Brimble 😭\n${err.response.data.msg}`
            )
          );
        } else if (err.request) {
          spinner.fail(
            chalk.red(`Make sure you are connected to the internet`)
          );
        } else {
          spinner.fail(
            chalk.red(`Error removing domain from Brimble 😭\n${err.message}`)
          );
        }
        process.exit(1);
      });
  }
};

export default domains;
