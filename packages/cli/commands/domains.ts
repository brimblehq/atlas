import { log } from "@brimble/utils";
import chalk from "chalk";
import { Command, Option } from "commander";
import Conf from "configstore";
import isValidDomain from "is-valid-domain";
import ora from "ora";
import { FEEDBACK_MESSAGE, projectConfig, setupAxios } from "../helpers";

const domains = async (value: string, options: Option, command: Command) => {
  const config = new Conf("brimble");
  const token = config.get("token");
  if (!token) {
    log.error(chalk.red("You must login first"));
    process.exit(1);
  }

  const projectConf = await projectConfig();
  const project = projectConf.get("project");
  const id = project.id;

  if (!project || !id) {
    log.error(chalk.red("You must create a project first"));
    process.exit(1);
  }

  if (command.name() === "list") {
    const spinner = ora(`Listing domains connected`).start();

    setupAxios(token)
      .get(`/domains?id=${id}`)
      .then(({ data }) => {
        const { domains } = data;
        spinner.succeed(chalk.green(`${domains.length} domains found 🤓`));
        domains.forEach(({ name }: { name: string }) => {
          log.info(chalk.green(`${name}`));
        });
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
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
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(1);
      });
  } else if (command.name() === "add") {
    if (!isValidDomain(value)) {
      log.error(chalk.red("Invalid domain"));
      process.exit(1);
    }

    const spinner = ora(`Adding domain ${value}`).start();

    setupAxios(token)
      .post(`/domains`, {
        domain: value,
        projectId: id,
      })
      .then(({ data }) => {
        const { domain, info } = data;
        if (info) {
          log.warn(chalk.yellow(`${info}`));
        }
        spinner.succeed(chalk.green(`${domain.name} added 🤓`));
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
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
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(1);
      });
  } else if (command.name() === "delete") {
    if (!isValidDomain(value)) {
      log.error(chalk.red("Invalid domain"));
      process.exit(1);
    }

    const spinner = ora(`Removing domain ${value}`).start();

    setupAxios(token)
      .delete(`/domains?domain=${value}&projectId=${id}`)
      .then(() => {
        spinner.succeed(chalk.green(`${value} removed 🤓`));
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
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
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(1);
      });
  }
};

export default domains;
