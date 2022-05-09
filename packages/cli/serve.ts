import chalk from "chalk";
import fs, { ReadStream, createReadStream } from "fs";
import path from "path";
import http from "http";
import getPort from "get-port";
import { Request, Response } from "express";
import mime from "mime-types";
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
    const index = files.find((file) => file.endsWith("index.html"));
    if (!index) {
      throw new Error("No index.html found");
    }

    // Serve static file
    const PORT = await getPort({
      port: options.port || 3000,
    });
    const HOST = "http://127.0.0.1";
    http.createServer(requestListener).listen(PORT, () => {
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
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(1);
  }
};

export default serve;
