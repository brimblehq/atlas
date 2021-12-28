import chalk from "chalk";
import fs from "fs";
import express from "express";
import getPort from "get-port";
import history from "connect-history-api-fallback";

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
    const app = express();
    const PORT = await getPort({ port: 3000 });
    const htmlFiles = files.filter((file) => file.endsWith(".html"));
    const rewrites = [
      ...htmlFiles.map((file) => {
        const name = file.replace(folder, "").replace(".html", "");
        return {
          from: new RegExp(`/${name.startsWith("/") ? name.slice(1) : name}`),
          to: file,
        };
      }),
    ];

    const historyMiddleware = history({
      rewrites,
      verbose: true,
      disableDotRule: true,
    });

    app.use(express.static(folder));
    app.use(historyMiddleware);
    app.use(express.static(folder));

    app.get("*", historyMiddleware, (req, res) => {
      console.log(req.url);
      res.sendFile(req.url);
    });

    app.listen(PORT, () => {
      console.log(chalk.green(`Serving to 👉🏻 http://127.0.0.1:${PORT}`));
    });
  } catch (err) {
    console.log(chalk.red(err));
  }
};

export default serve;
