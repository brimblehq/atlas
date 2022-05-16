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
    stdio: "inherit",
  });

  install.on("close", (code) => {
    if (code !== 0) {
      console.error(chalk.red("Install failed"));
      process.exit(1);
    }

    const build = spawn(ci.build, ci.buildArgs, {
      cwd: dir,
      stdio: "inherit",
    });

    build.on("close", (code) => {
      if (code !== 0) {
        console.error(chalk.red("Build failed"));
        process.exit(1);
      }

      const start = spawn(ci.start, ci.startArgs, {
        cwd: dir,
        stdio: "inherit",
      });

      console.log(`PID: ${start.pid}`);

      start.on("close", (code) => {
        if (code !== 0) {
          console.error(chalk.red("Start failed"));
          process.exit(1);
        }
      });
    });
  });
};
