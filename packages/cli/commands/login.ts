import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import inquirer from "inquirer";
import ora from "ora";
import { GIT_TYPE } from "@brimble/models";
const open = require("better-opn");
import { API_URL, FEEDBACK_MESSAGE, setupAxios, socket } from "../helpers";

const login = async ({ email, auth }: { email: string; auth: string }) => {
  const config = new Conf("brimble");

  if (
    (auth && auth.toUpperCase() === GIT_TYPE.GITHUB) ||
    auth.toUpperCase() === GIT_TYPE.GITLAB ||
    auth.toUpperCase() === GIT_TYPE.BITBUCKET
  ) {
    const device =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    open(`${API_URL}/auth/signin/${auth.toLowerCase()}?device=${device}`);

    const spinner = ora("Waiting for authentication").start();

    socket
      .on(
        `${device}`,
        (data: {
          access_token: string;
          refresh_token: string;
          id: string;
          email: string;
          oauth: boolean;
        }) => {
          config.set("user", {
            email: data.email,
            id: data.id,
            token: data.access_token,
            refresh_token: data.refresh_token,
            oauth: data.oauth,
          });
          spinner.succeed(chalk.green("Successfully logged in"));
          log.info(chalk.greenBright(FEEDBACK_MESSAGE));

          socket.disconnect();
          process.exit(0);
        }
      )
      .on("error", (err: string) => {
        spinner.fail(chalk.red(err));
        log.info(chalk.greenBright(FEEDBACK_MESSAGE));
        process.exit(1);
      });
  } else {
    const { email: emailAnswer } = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "Enter your email",
        when: !email,
        validate: (input: string) => {
          if (!input) {
            return "Email is required";
          }

          if (!input.includes("@")) {
            return "Invalid email";
          }

          return true;
        },
      },
    ]);

    const spinner = ora("Logging in to Brimble cloud").start();

    setupAxios()
      .post("/auth/beta/login", { email: emailAnswer || email })
      .then(async ({ data }) => {
        const { message } = data;
        if (message) {
          spinner.succeed(chalk.green(message));
        }
        const { access_code } = await inquirer.prompt([
          {
            type: "input",
            name: "access_code",
            message: "Enter your access code",
            validate: (input: string) => {
              if (!input) {
                return "Access code is required";
              }

              return true;
            },
          },
        ]);

        spinner.start("Authenticating");
        spinner.color = "yellow";
        setupAxios()
          .post("/auth/beta/verify-email", {
            access_code,
            email: emailAnswer || email,
          })
          .then(({ data }) => {
            const { access_token, refresh_token, email } = data.data;
            config.set("token", access_token);
            config.set("refresh_token", refresh_token);
            config.set("email", email);
            spinner.succeed(chalk.green("Successfully logged in"));

            log.info(chalk.greenBright(FEEDBACK_MESSAGE));
            process.exit(0);
          })
          .catch((err) => {
            if (err.response) {
              spinner.fail(chalk.red(err.response.data.message));
            } else if (err.request) {
              spinner.fail(
                chalk.red(`Make sure you are connected to the internet`)
              );
            } else {
              spinner.fail(chalk.red(err.message));
            }

            log.info(chalk.greenBright(FEEDBACK_MESSAGE));
            process.exit(1);
          });
      })
      .catch((err) => {
        if (err.response) {
          spinner.fail(chalk.red(err.response.data.message));

          inquirer
            .prompt([
              {
                type: "confirm",
                name: "retry",
                message: "Try again?",
              },
            ])
            .then((answers) => {
              if (answers.retry) {
                login({ email: emailAnswer || email, auth });
              } else {
                process.exit(1);
              }
            });
        } else if (err.request) {
          spinner.fail(
            chalk.red(`Make sure you are connected to the internet`)
          );
          log.info(chalk.greenBright(FEEDBACK_MESSAGE));
          process.exit(1);
        } else {
          spinner.fail(chalk.red(err.message));
          log.info(chalk.greenBright(FEEDBACK_MESSAGE));
          process.exit(1);
        }
      });
  }
};

export default login;
