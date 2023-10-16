import spawn from "cross-spawn";
import chalk from "chalk";

type IOpt = {
  _build: string;
  buildArgs: string[];
  dir: string;
};

export const buildScript = ({ _build, buildArgs, dir }: IOpt) => {
  return new Promise((resolve, reject) => {
    const build = spawn(_build, buildArgs, { cwd: dir, shell: true });

    build.stdout?.on("data", (data) => {
      console.log(`${chalk.green(data.toString())}`);
    });

    build.stderr?.on("data", (data) => {
      console.log(`${chalk.red(data.toString())}`);
    });

    build.on("close", (code) => {
      if (code !== 0) {
        console.error(`${chalk.red(`Build failed with code ${code}`)}`);
        reject(new Error(`Build failed with code ${code}`));
      }
      resolve(0);
    });

    build.on("error", (err) => {
      console.log(`${chalk.red(err)}`);
      reject(err); // Reject the Promise on an error
    });
  });
};
