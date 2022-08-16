import chalk from "chalk";
import spawn from "cross-spawn";
import { startScript } from "./start";

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
  }
) => {
  const install = spawn(ci.install, ci.installArgs, {
    cwd: dir,
  });

  install.stdout?.on("data", (data) => {
    console.log(chalk.green(data.toString()));
  });

  install.stderr?.on("data", (data) => {
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

    build.stdout?.on("data", (data) => {
      console.log(chalk.green(data.toString()));
    });

    build.stderr?.on("data", (data) => {
      console.log(chalk.red(data.toString()));
    });

    build.on("close", (code) => {
      if (code !== 0) {
        console.error(chalk.red(`Build failed with code ${code}`));
        process.exit(1);
      }

      startScript({
        ci: { start: ci.start, startArgs: ci.startArgs },
        server,
        dir,
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
