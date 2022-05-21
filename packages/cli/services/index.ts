import chalk from "chalk";
import { spawn } from "child_process";

export const serveStack = (
  dir: string,
  ci: {
    install: string;
    build: string;
    start: string;
    installArgs: string[];
    buildArgs: string[];
    startArgs: string[];
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

      const start = spawn(ci.start, ci.startArgs, {
        cwd: dir,
      });

      start.stdout.on("data", (data) => {
        console.log(chalk.green(data.toString()));
        console.log(`PID: ${start.pid}`);
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
    });

    build.on("error", (err) => {
      console.log(chalk.red(err));
    });
  });

  install.on("error", (err) => {
    console.log(chalk.red(err));
  });
};
