import { spawn } from "child_process";
import chalk from "chalk";
import { dirValidator } from "../helpers";
import { customServer } from "../commands/serve";
export const startScript = ({
  ci,
  server,
  dir,
}: {
  ci: { start?: string; startArgs?: any };
  server: {
    outputDirectory?: string;
    port: number;
    host: string;
    isOpen?: boolean;
  };
  dir: string;
}) => {
  if (ci.start) {
    const start = spawn(`PORT=${server.port}`, [ci.start, ...ci.startArgs], {
      cwd: dir,
      shell: true,
    });

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
        customServer(server.port, server.host, server.isOpen);
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
};
