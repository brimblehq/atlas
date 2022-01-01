import chalk from "chalk";
import fs, { ReadStream, createReadStream } from "fs";
import path from "path";
import http from "http";
import getPort from "get-port";
import { Request, Response } from "express";
import mime from "mime";
const open = require("better-opn");

const getAllFiles = function (
  folder: string,
  arrayOfFiles: string[] = []
): string[] {
  const files = fs.readdirSync(folder, { withFileTypes: true });

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(`${folder}/${file.name}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(`${folder}/${file.name}`);
    }
  });

  return arrayOfFiles;
};

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

const staticFileHandler = (
  req: Request,
  res: Response,
  filePath: string,
  contentType: string
): ReadStream | void => {
  if (!fs.existsSync(filePath)) {
    if (filePath.endsWith(".html")) {
      filePath = path.resolve("./" + "index.html");
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end(`<h1>404: ${req.url} not found</h1>`);
    }
  }
  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": fs.statSync(filePath).size,
    server: "Brimble",
  });
  createReadStream(filePath).pipe(res);
};

const serve = async (directory: string = ".") => {
  try {
    process.chdir(directory);
    const folder = process.cwd();
    const files = getAllFiles(folder);
    const index = files.find((file) => file.endsWith("index.html"));
    if (!index) {
      throw new Error("No index.html found");
    }

    // Serve static file
    const PORT = await getPort({ port: 3000 });
    http.createServer(requestListener).listen(PORT, () => {
      open(`http://localhost:${PORT}`);
      console.log(chalk.green(`Serving to 👉🏻 http://localhost:${PORT}`));
    });
  } catch (err) {
    console.error(chalk.red(err));
  }
};

export default serve;
