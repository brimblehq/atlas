import { log } from "@brimble/utils";
import chalk from "chalk";
import { Command } from "commander";
import Table from "cli-table3";
import inquirer from "inquirer";
import ora from "ora";
import Conf from "configstore";
import { FEEDBACK_MESSAGE, setupAxios } from "../helpers";

const env = async (
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

        setupAxios(token)
          .post(
            `/env`,
            isNaN(parseInt(value.toString()))
              ? {
                  projectName: value,
                  environments: results,
                }
              : {
                  projectID: value,
                  environments: results,
                }
          )
          .then(({ data }) => {
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
  }
};

export default env;
