import { log } from "@brimble/utils";
import chalk from "chalk";
import Conf from "configstore";
import inquirer from "inquirer";
import { setupAxios } from "../helpers";

const login = async ({ email }: { email: string }) => {
  const config = new Conf("brimble");
  log.info(chalk.green(`Logging in to Brimble cloud...`));

  const questions: any = [];

  if (!email) {
    questions.push({
      type: "input",
      name: "email",
      message: "Enter your email",
      validate: (input: string) => {
        if (!input) {
          return "Email is required";
        }

        if (!input.includes("@")) {
          return "Invalid email";
        }

        return true;
      },
    });
  }

  const answers = await inquirer.prompt(questions);

  const { email: emailAnswer } = answers;

  setupAxios()
    .post("/auth/beta/login", { email: emailAnswer || email })
    .then(({ data }) => {
      const { message } = data;
      if (message) {
        log.info(chalk.green(message));
      }
      questions[0] = {
        type: "input",
        name: "access_code",
        message: "Enter your access code",
        validate: (input: string) => {
          if (!input) {
            return "Access code is required";
          }

          return true;
        },
      };

      inquirer.prompt(questions).then((answers) => {
        const { access_code } = answers;

        setupAxios()
          .post("/auth/beta/verify-email", {
            access_code,
            email: emailAnswer || email,
          })
          .then(({ data }) => {
            const { access_token, refresh_token } = data.data;
            config.set("token", access_token);
            config.set("refresh_token", refresh_token);
            log.info(chalk.green(`Logged in successfully!`));

            process.exit(0);
          })
          .catch((err) => {
            if (err.response) {
              log.error(chalk.red(err.response.data.message));
            } else {
              log.error(chalk.red(err.message));
            }

            process.exit(1);
          });
      });
    })
    .catch((err) => {
      if (err.response) {
        log.error(chalk.red(err.response.data.message));

        questions[0] = {
          type: "confirm",
          name: "retry",
          message: "Try again?",
        };

        inquirer.prompt(questions).then((answers) => {
          if (answers.retry) {
            login({ email: emailAnswer || email });
          } else {
            process.exit(1);
          }
        });
      } else {
        log.error(chalk.red(err.message));
        process.exit(1);
      }
    });
};

export default login;
