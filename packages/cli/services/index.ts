import chalk from "chalk";
import spawn from "cross-spawn";
import { startScript } from "./start";
import { installScript } from "./install";

export const serveStack = async (
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
    watch?: boolean;
  }
) => {
  await installScript({
    _install: ci.install,
    installArgs: ci.installArgs,
    dir,
  });

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
};
