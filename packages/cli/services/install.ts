import spawn from "cross-spawn";
import chalk from "chalk";

type IOpt = {
  _install: string;
  installArgs?: string[];
  dir: string;
};

export const installScript = ({ _install, installArgs, dir }: IOpt) => {
  return new Promise((resolve, reject) => {
    console.log(
      `${chalk.green(`${_install.toUpperCase()}: Installing dependencies...`)}`
    );
    const install = spawn(_install, installArgs, {
      cwd: dir,
      shell: true,
    });

    install.stdout?.on("data", (data) => {
      console.log(`${chalk.green(data.toString())}`);
    });

    install.stderr?.on("data", (data) => {
      console.log(`${chalk.red(data.toString())}`);
    });

    install.on("close", (code) => {
      if (code !== 0) {
        console.error(`${chalk.red(`Install failed with code ${code}`)}`);
        reject(new Error(`Install failed with code ${code}`));
      }
      resolve(0);
    });

    install.on("error", (err) => {
      console.log(`${chalk.red(err)}`);
      reject(err); // Reject the Promise on an error
    });
  });
};
