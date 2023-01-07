import spawn from "cross-spawn";
import chalk from "chalk";
import { dirValidator } from "../helpers";
import { customServer } from "../commands/serve";
import path from "path";
import dayjs from "dayjs";
export const startScript = ({
  ci,
  server,
  dir,
}: {
  ci: { start?: string; startArgs?: any; build?: string; buildArgs?: any };
  server: {
    outputDirectory?: string;
    port: number;
    host: string;
    isOpen?: boolean;
  };
  dir: string;
}) => {
  if (ci.build) {
    const build = spawn(ci.build, ci.buildArgs, {
      cwd: dir,
    });

    build.stdout?.on("data", (data) => {
      console.log(
        `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.green(data.toString())}`
      );
    });

    build.stderr?.on("data", (data) => {
      console.log(
        `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(data.toString())}`
      );
    });

    build
      .on("close", (code) => {
        if (code !== 0) {
          console.error(
            `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(
              `Build failed with code ${code}`
            )}`
          );
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

          start.stdout?.on("data", (data) => {
            const message = data.toString();

            if (message.match(/http:\/\/[a-zA-Z0-9-.]+:[0-9]+/g)) {
              console.log(
                `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.green(
                  message
                )} \n PID: ${start.pid}`
              );
            } else {
              console.log(
                `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.green(message)}`
              );
            }
          });

          start.stderr?.on("data", (data) => {
            console.log(
              `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(
                data.toString()
              )}`
            );
          });

          start
            .on("close", (code) => {
              if (code !== 0) {
                console.error(
                  `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(
                    `Start failed with code ${code}`
                  )}`
                );
                process.exit(1);
              }
            })
            .on("error", (err) => {
              console.log(
                `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(err)}`
              );
            });
        } else if (server.outputDirectory) {
          normalStart({ dir, server });
        } else {
          console.log(
            `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(
              "Start failed with error: The folder doesn't contain index.html"
            )}`
          );
          process.exit(1);
        }
      })
      .on("error", (err) => {
        console.log(`${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(err)}`);
      });
  } else if (server.outputDirectory) {
    normalStart({ dir, server });
  } else {
    console.log(
      `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(
        "No build script found"
      )}`
    );
    process.exit(1);
  }
};

const normalStart = ({ dir, server }: { dir: string; server: any }) => {
  try {
    const { files } = dirValidator(
      `${path.join(`${dir}/${server.outputDirectory}`)}`
    );
    if (files.includes("index.html")) {
      customServer(server.port, server.host, server.isOpen);
    } else {
      throw new Error("The folder doesn't contain index.html");
    }
  } catch (error) {
    const { message } = error as Error;
    console.log(
      `${dayjs().format("HH:mm:ss.SSS")} --- ${chalk.red(
        `Start failed with error: ${message}`
      )}`
    );
    process.exit(1);
  }
};
