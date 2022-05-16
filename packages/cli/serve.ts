import chalk from "chalk";
import fs, { ReadStream, createReadStream } from "fs";
import path from "path";
import { createServer } from "http";
import getPort from "get-port";
import { Request, Response } from "express";
import mime from "mime-types";
import { detectFramework } from "@brimble/utils";
import { serveStack } from "./services";
const open = require("better-opn");

const requestListener = (req: any, res: any) => {
  const htmlFile =
    req.url === "/"
      ? "index.html"
      : req.url.endsWith("/")
      ? `${req.url.slice(0, -1)}.html`
      : !req.url.includes(".")
      ? `${req.url}.html`
      : req.url;

  const filePath = path.resolve("./" + htmlFile);

  const fileExt = String(path.extname(filePath)).toLowerCase();
  const mimeType = mime.lookup(fileExt) || "application/octet-stream";

  staticFileHandler(req, res, filePath, mimeType);
};

const streamHandler = (
  statusCode: number,
  filePath: string,
  res: Response,
  contentType: string
): ReadStream => {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    server: "Brimble",
    "Cache-Control": "public, max-age=0, must-revalidate",
  });

  const stream = createReadStream(filePath).on("open", () => {
    stream.pipe(res);
  });

  return stream;
};

const staticFileHandler = (
  req: Request,
  res: Response,
  filePath: string,
  contentType: string
): ReadStream | void => {
  if (!fs.existsSync(filePath)) {
    if (filePath.endsWith(".html")) {
      filePath = path.resolve("./" + "index.html");
    }
  }

  const stream = streamHandler(200, filePath, res, contentType);

  if (stream) {
    stream
      .on("error", (err) => {
        console.error(chalk.red(err.message));
        streamHandler(404, path.resolve("./404.html"), res, "text/html").on(
          "error",
          (err) => {
            res.writeHead(404, {
              "Content-Type": "text/html",
              server: "Brimble",
              "Cache-Control": "public, max-age=0, must-revalidate",
            });
            // TODO: change it to a better 404 page
            res.end(`<h1>404: ${filePath} not found</h1>`);
          }
        );
      })
      .on("finish", () => {
        res.end();
      });
  }
};

const serve = async (
  directory: string = ".",
  options: { port?: number; open?: boolean; deploy?: boolean } = {}
) => {
  try {
    process.chdir(directory);
    const folder = process.cwd();
    const files = fs.readdirSync(folder);

    // TODO: check if the folder is empty
    if (!files.length) {
      throw new Error("The folder is empty");
    }

    // TODO: check if the folder contains index.html or package.json
    if (!files.includes("index.html") && !files.includes("package.json")) {
      throw new Error("The folder doesn't contain index.html or package.json");
    }

    const PORT = await getPort({
      port: options.port,
    });
    const HOST = "http://127.0.0.1";

    if (files.includes("package.json")) {
      // TODO: get package.json and detect the framework
      const packageJson = require(path.resolve(folder, "package.json"));
      const framework = detectFramework(packageJson);
      if (framework.name !== "Other") {
        const devCommand = framework.settings.devCommand.value?.split(" ")[0];
        const devArgs = framework.settings.devCommand.value
          ?.split(" ")
          .slice(1);

        if (devCommand && devArgs) {
          devArgs?.push(`--port=${PORT}`);

          serveStack(folder, { devCommand, devArgs });
        }
      } else {
        throw new Error("The framework is not yet supported");
      }
    } else if (files.includes("index.html")) {
      // Serve static file

      createServer(requestListener).listen(PORT, () => {
        let deployUrl = `${HOST}:${PORT}`;

        if (options.open) {
          open(`${deployUrl}`);
        }

        console.log(
          chalk.green(
            `${
              options.deploy
                ? `Successfully deployed to ${chalk.green(`Brimble`)} 🎉`
                : ""
            }\nServing to ${deployUrl}\nPID: ${process.pid}`
          )
        );
      });
    } else {
      throw new Error("The folder doesn't contain index.html or package.json");
    }
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(1);
  }
};

export default serve;
