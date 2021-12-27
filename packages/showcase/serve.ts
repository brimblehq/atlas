import chalk from "chalk";
import fs from "fs";
import express from "express";
import getPort from "get-port";
import history from "connect-history-api-fallback";

const serve = async (folder: string = ".") => {
  try {
    const files = fs.readdirSync(folder, { withFileTypes: true });
    const index = files.find((file) => file.name.endsWith("index.html"));
    if (!index) {
      throw new Error("No index.html found");
    }

    // Serve static file
    const app = express();
    const PORT = await getPort({ port: 3000 });
    const htmlFiles = files.filter((file) => file.name.endsWith(".html"));
    const directory = files.filter((de) => de.isDirectory());
    const rewrites = [
      ...directory.map((dir) => {
        let dirFiles = fs.readdirSync(`${folder}/${dir.name}`, {
          withFileTypes: true,
        });
        const mapDirs = dirFiles.map((file) => {
          const name = file.name.replace(".html", "");
          return {
            from: new RegExp(`/${dir.name}/${name}`),
            to: `/${dir.name}/${file.name}`,
          };
        });
        return mapDirs;
      }),
      ...htmlFiles.map((file) => {
        const name = file.name.replace(".html", "");
        return {
          from: new RegExp(`/${name}`),
          to: `/${file.name}`,
        };
      }),
    ]
      .filter(Boolean)
      .flat();

    app.use(express.static(folder));
    app.use(history({ rewrites }));
    app.use(express.static(folder));
    app.listen(PORT, () => {
      console.log(chalk.green(`Serving to 👉🏻 http://127.0.0.1:${PORT}`));
    });
  } catch (err) {
    console.log(chalk.red(err));
  }
};

export default serve;
