import chalk from "chalk";
import { spawn } from "child_process";
import { dirValidator } from "../helpers";
import { customServer } from "../serve";

export const serveStack = (
  dir: string,
  ci: {
    install: string;
    build: string;
    start?: string;
    installArgs: string[];
    buildArgs: string[];
    startArgs?: any;
  },
  server: {
    outputDirectory?: string;
    port: number;
    host: string;
    isOpen?: boolean;
    isDeploy?: boolean;
  }
) => {
  const install = spawn(ci.install, ci.installArgs, {
    cwd: dir,
  });

  install.stdout.on("data", (data) => {
    console.log(chalk.green(data.toString()));
  });

  install.stderr.on("data", (data) => {
    console.log(chalk.red(data.toString()));
  });

  install.on("close", (code) => {
    if (code !== 0) {
      console.error(chalk.red(`Install failed with code ${code}`));
      process.exit(1);
    }

    const build = spawn(ci.build, ci.buildArgs, {
      cwd: dir,
    });

    build.stdout.on("data", (data) => {
      console.log(chalk.green(data.toString()));
    });

    build.stderr.on("data", (data) => {
      console.log(chalk.red(data.toString()));
    });

    build.on("close", (code) => {
      if (code !== 0) {
        console.error(chalk.red(`Build failed with code ${code}`));
        process.exit(1);
      }

      if (ci.start) {
        const start = spawn(
          `PORT=${server.port}`,
          [ci.start, ...ci.startArgs],
          {
            cwd: dir,
            shell: true,
          }
        );

        start.stdout.on("data", (data) => {
          const message = data.toString();

          if (message.match(/http:\/\/[a-zA-Z0-9-.]+:[0-9]+/g)) {
            console.log(`${chalk.green(message)} \n PID: ${start.pid}`);
          } else {
            console.log(chalk.green(message));
          }
        });

        start.stderr.on("data", (data) => {
          console.log(chalk.red(data.toString()));
        });

        start.on("close", (code) => {
          if (code !== 0) {
            console.error(chalk.red(`Start failed with code ${code}`));
            process.exit(1);
          }
        });

        start.on("error", (err) => {
          console.log(chalk.red(err));
        });
      } else if (server.outputDirectory) {
        try {
          const { files } = dirValidator(`${dir}/${server.outputDirectory}`);
          if (files.includes("index.html")) {
            customServer(
              server.port,
              server.host,
              server.isOpen,
              server.isDeploy
            );
          } else {
            console.log(chalk.red("The folder doesn't contain index.html"));
            process.exit(1);
          }
        } catch (error) {
          const { message } = error as Error;
          console.log(chalk.red(message));
          process.exit(1);
        }
      }
    });

    build.on("error", (err) => {
      console.log(chalk.red(err));
    });
  });

  install.on("error", (err) => {
    console.log(chalk.red(err));
  });
};
