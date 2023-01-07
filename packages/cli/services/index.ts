import chalk from "chalk";
import spawn from "cross-spawn";
import dayjs from "dayjs";
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
    console.log(
      `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.green(data.toString())}`
    );
  });

  install.stderr?.on("data", (data) => {
    console.log(
      `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(data.toString())}`
    );
  });

  install.on("close", (code) => {
    if (code !== 0) {
      console.error(
        `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(
          `Install failed with code ${code}`
        )}`
      );
      process.exit(1);
    }
    startScript({
      ci: {
        start: ci.start,
        startArgs: ci.startArgs,
        build: ci.build,
        buildArgs: ci.buildArgs,
      },
      server,
      dir,
    });
  });

  install.on("error", (err) => {
    console.log(`${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(err)}`);
  });
};
