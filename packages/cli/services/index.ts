import chalk from "chalk";
import { spawn } from "child_process";

export const serveStack = (
  dir: string,
  framework: {
    devCommand: any;
    devArgs: string[];
  }
) => {
  const child = spawn(framework.devCommand, framework.devArgs, {
    cwd: dir,
    stdio: "inherit",
  });

  child.on("close", (code) => {
    if (code !== 0) {
      console.log(
        chalk.red(
          `The dev process exited with code ${code}.
        This usually means that the dev server crashed.
        Check the logs above to see what went wrong.`
        )
      );
    }
  });

  child.on("error", (err) => {
    console.error(
      chalk.red(
        `The dev process exited with an error.
      Check the logs above to see what went wrong.`
      )
    );
    console.error(err);
  });
};
