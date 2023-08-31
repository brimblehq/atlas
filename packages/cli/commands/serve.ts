import chalk from "chalk";
import fs from "fs";
import path from "path";
import getPort from "get-port";
import express, { Application } from "express";
import inquirer from "inquirer";
import { detectFramework, log } from "@brimble/utils";
import { serveStack } from "../services";
import { dirValidator, FEEDBACK_MESSAGE } from "../helpers";
import { startScript } from "../services/start";
import history from "connect-history-api-fallback";
const open = require("better-opn");

export const customServer = (
  port: number,
  host: string,
  dir: string,
  isOpen?: boolean,
): void => {
  const app: Application = express();

  app.disable("x-powered-by");

  app.use(
    history({
      index: "index.html",
      rewrites: [
        {
          from: /^\/(?!$)([^.]*)$/,
          to: (context) => {
            let path = context.parsedUrl.path;
            path = path?.split("/")[1] || "";

            return fs.existsSync(`${path}.html`)
              ? `${path}.html`
              : fs.existsSync(`${path}/index.html`)
              ? `${path}/index.html`
              : "index.html";
          },
        },
      ],
    }),
  );

  app.use("/", express.static(dir));
  app.get("*", (req, res) => {
    // TODO: create a 404 page
    res.status(404).end(`<h1>404: ${req.url} not found</h1>`);
  });

  app.listen(port, () => {
    let deployUrl = `http://${host}:${port}`;

    if (isOpen) {
      open(`${deployUrl}`);
    }

    console.log(chalk.green(`Serving to ${deployUrl}\n PID: ${process.pid}`));

    log.info(chalk.greenBright(FEEDBACK_MESSAGE));
  });
};

const serve = async (
  directory: string = ".",
  options: {
    port?: number;
    host?: string;
    open?: boolean;
    buildCommand?: string;
    outputDirectory?: string;
    startOnly?: boolean;
  } = {},
) => {
  try {
    const { folder, files } = dirValidator(directory);
    const PORT = await getPort({ port: options.port });
    const HOST = options.host || "0.0.0.0";

    if (files.includes("package.json")) {
      const packageJson = require(path.resolve(folder, "package.json"));
      const framework = detectFramework(packageJson);
      let { installCommand, buildCommand, startCommand, outputDirectory } =
        framework.settings;
      let build = options.buildCommand
        ? options.buildCommand.split(" ")[0]
        : buildCommand
        ? buildCommand.split(" ")[0]
        : "";
      let buildArgs = options.buildCommand
        ? options.buildCommand.split(" ").slice(1)
        : buildCommand
        ? buildCommand.split(" ").slice(1)
        : [];
      let start = startCommand?.split(" ")[0];
      let startArgs = startCommand?.split(" ").slice(1);

      outputDirectory = options.outputDirectory || outputDirectory;

      if (options.startOnly) {
        switch (framework.slug) {
          case "angular":
            buildArgs.push(`--output-path=${outputDirectory}`);
            break;
          case "astro":
            const astroConfig = fs.readFileSync(
              path.resolve(folder, "astro.config.mjs"),
              "utf8",
            );
            if (
              astroConfig?.includes("output") &&
              astroConfig?.includes('output: "server"')
            ) {
              start = "node";
              startArgs = [`${outputDirectory}/server/entry.mjs`];
            }
            break;
          case "remix":
            startArgs?.push(outputDirectory || "dist");
            break;
          default:
            break;
        }

        startScript({
          ci: { start, startArgs, build, buildArgs },
          dir: folder,
          server: {
            outputDirectory,
            isOpen: options.open,
            port: PORT,
            host: HOST,
          },
        });
      } else {
        inquirer
          .prompt([
            {
              name: "buildCommand",
              message: "Build command",
              default: buildCommand,
              when: !options.buildCommand,
            },
            {
              name: "outputDirectory",
              message: "Output directory",
              default: outputDirectory,
              when: !!outputDirectory && !options.outputDirectory,
            },
          ])
          .then(({ buildCommand, outputDirectory: optDir }) => {
            const install = installCommand?.split(" ")[0] || "yarn";
            const installArgs = installCommand?.split(" ").slice(1) || [
              "--production=false",
            ];

            build = buildCommand ? buildCommand.split(" ")[0] : build;
            buildArgs = buildCommand
              ? buildCommand.split(" ").slice(1)
              : buildArgs;
            outputDirectory = optDir || outputDirectory || "dist";

            switch (framework.slug) {
              case "angular":
                buildArgs.push(`--output-path=${outputDirectory}`);
                break;
              case "astro":
                const astroConfig = fs.readFileSync(
                  path.resolve(folder, "astro.config.mjs"),
                  "utf8",
                );
                if (
                  astroConfig?.includes("output") &&
                  astroConfig?.includes('output: "server"')
                ) {
                  start = "node";
                  startArgs = [`${outputDirectory}/server/entry.mjs`];
                }
                break;
              case "remix":
                startArgs?.push(outputDirectory || "");
                break;
              case "svelte":
                const svelteConfig = fs.readFileSync(
                  path.resolve(folder, "svelte.config.js"),
                  "utf8",
                );

                if (svelteConfig?.includes("@sveltejs/adapter-static")) {
                  const pages = svelteConfig.match(/(?<=pages: )(.*?)(?=,)/);
                  outputDirectory = pages
                    ? pages[0].replace(/'/g, "")
                    : "build";
                } else {
                  const out = svelteConfig.match(/(?<=out: )(.*?)(?=,)/);
                  start = "node";
                  startArgs = [out ? out[0].replace(/'/g, "") : "build"];
                }
              default:
                break;
            }

            serveStack(
              folder,
              { install, installArgs, build, buildArgs, start, startArgs },
              { outputDirectory, isOpen: options.open, port: PORT, host: HOST },
            );
          });
      }
    } else if (files.includes("index.html")) {
      customServer(PORT, HOST, folder, options.open);
    } else {
      throw new Error(
        `This folder ("${directory}") doesn't contain index.html or package.json`,
      );
    }
  } catch (err) {
    const { message } = err as Error;
    log.error(chalk.red(`Start failed with error: ${message}`));

    log.info(chalk.greenBright(FEEDBACK_MESSAGE));
    process.exit(1);
  }
};

export default serve;
