import { log } from "@brimble/utils";
import chalk from "chalk";
import { Command, Option } from "commander";
import Table from "cli-table3";
import inquirer from "inquirer";
import ora from "ora";
import {
  FEEDBACK_MESSAGE,
  isLoggedIn,
  projectConfig,
  setupAxios,
} from "../helpers";

const env = async (value: string, options: Option, command: Command) => {
  const user = isLoggedIn();
  if (!user) {
    log.error(chalk.red("You are not logged in"));
    process.exit(1);
  }

  const projectConf = await projectConfig();
  const project = projectConf.get("project");
  const id = project.id;

  if (!project || !id) {
    log.error(chalk.red("You must create a project first"));
    process.exit(1);
  }

  if (command.name() === "add") {
    const results: { name: string; value: string }[] = [];
    const askQuestions = async () => {
      if (results.length) {
        log.info(`To exit, type ${chalk.green("exit")}`);
      }

      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: `Enter the name of the ${
            results.length ? "another env" : "env"
          }`,
          validate: (input: string) => (!input ? "Please enter a name" : true),
        },
      ]);

      if (name.toLowerCase() !== "exit") {
        if (name.includes("=")) {
          results.push({ name: name.split("=")[0], value: name.split("=")[1] });
        } else {
          const { value } = await inquirer.prompt([
            {
              type: "input",
              name: "value",
              message: `Enter the value for ${name.toUpperCase()}`,
              validate: (input: string) =>
                !input ? "Please enter a value" : true,
            },
          ]);
          results.push({ name, value });
        }

        askQuestions();
      } else {
        const spinner = ora(`Adding ${results.length} env variables`).start();

        setupAxios(user.token)
          .post(`/env`, { projectId: id, environments: results })
          .then(() => {
            spinner.succeed(
              chalk.green(`${results.length} env variables added 🤓`)
            );

            const table = new Table({
              head: ["Name", "Value"],
            });

            results.forEach((result: { name: string; value: string }) => {
              table.push([result.name, result.value]);
            });
            console.log(table.toString());

            log.info(chalk.greenBright(FEEDBACK_MESSAGE));
            process.exit(0);
          })
          .catch((err) => {
            if (err.response) {
              spinner.fail(
                chalk.red(
                  `Error adding env variables to Brimble 😭\n${err.response.data.msg}`
                )
              );
            } else if (err.request) {
              spinner.fail(
                chalk.red(`Make sure you are connected to the internet`)
              );
            } else {
              spinner.fail(
                chalk.red(
                  `Error adding env variables to Brimble 😭\n${err.message}`
                )
              );
            }

            log.info(chalk.greenBright(FEEDBACK_MESSAGE));
            process.exit(1);
          });
      }
    };

    askQuestions();
  } else if (command.name() === "list") {
    const spinner = ora(`Getting env variables`).start();

    setupAxios(user.token)
      .get(`/env?projectId=${id}`)
      .then(({ data }) => {
        spinner.succeed(chalk.green("Env variables retrieved 🤓"));

        const table = new Table({
          head: ["Name", "Value"],
        });

        data.env?.forEach((result: { name: string; value: string }) => {
          table.push([result.name, result.value]);
        });
        console.log(table.toString());

        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(0);
      })
      .catch((err) => {
        if (err.response) {
          spinner.fail(
            chalk.red(
              `Error getting env variables 😭\n${err.response.data.msg}`
            )
          );
        } else if (err.request) {
          spinner.fail(
            chalk.red(`Make sure you are connected to the internet`)
          );
        } else {
          spinner.fail(
            chalk.red(`Error getting env variables 😭\n${err.message}`)
          );
        }

        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(1);
      });
  } else if (command.name() === "delete") {
    if (!options.name) {
      log.error(chalk.red("You must specify a project name"));
      process.exit(1);
    }

    if (!value) {
      log.error(chalk.red("Specify env to remove"));
      process.exit(1);
    }

    const spinner = ora("Deleting env variables").start();

    setupAxios(user.token)
      .delete(`/env?projectId=${id}&env=${value.toUpperCase()}`)
      .then(() => {
        spinner.succeed(chalk.green(`${value.toUpperCase()} removed 🤓`));

        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(0);
      })
      .catch((err) => {
        if (err.response) {
          spinner.fail(
            chalk.red(
              `Error deleting env variables 😭\n${err.response.data.msg}`
            )
          );
        } else if (err.request) {
          spinner.fail(
            chalk.red(`Make sure you are connected to the internet`)
          );
        } else {
          spinner.fail(
            chalk.red(`Error deleting env variables 😭\n${err.message}`)
          );
        }

        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(1);
      });
  }
};

export default env;
