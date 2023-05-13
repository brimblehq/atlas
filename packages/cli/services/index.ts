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
  console.log(
    `${chalk.green(`${ci.install.toUpperCase()}: Installing dependencies...`)}`
  );
  const install = spawn(ci.install, ci.installArgs, { cwd: dir, shell: true });

  install.stdout?.on("data", (data) => {
    console.log(`${chalk.green(data.toString())}`);
  });

  install.stderr?.on("data", (data) => {
    console.log(`${chalk.red(data.toString())}`);
  });

  install.on("close", (code) => {
    if (code !== 0) {
      console.error(`${chalk.red(`Install failed with code ${code}`)}`);
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
    console.log(`${chalk.red(err)}`);
  });
};
