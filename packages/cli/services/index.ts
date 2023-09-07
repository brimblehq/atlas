import chalk from "chalk";
import spawn from "cross-spawn";
import { startScript } from "./start";
import { execSync } from "child_process";
import { platform } from "os";

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
    version: string;
  }
) => {
  console.log(chalk.green(`Detected node version ${server.version}`));
  try {
    execSync(
      `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm install ${server.version}`,
      { cwd: dir, stdio: "inherit" }
    );
  } catch (error: any) {
    console.log(
      chalk.red(`Setting up environment failed with: ${error.message}`)
    );
    process.exit(1);
  }

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
