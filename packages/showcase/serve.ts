import chalk from "chalk";
import fs from "fs";
import express from "express";
import getPort from "get-port";
import history from "connect-history-api-fallback";

const serve = async (folder: string = ".") => {
  try {
    const files = fs.readdirSync(folder);
    const index = files.find((file) => file.endsWith("index.html"));
    if (!index) {
      throw new Error("No index.html found");
    }

    // Serve static file
    const app = express();
    const PORT = await getPort({ port: 3000 });
    const htmlFiles = files.filter((file) => file.endsWith(".html"));

    app.use(express.static(folder));
    app.use(
      history({
        rewrites: htmlFiles.map((file) => {
          const name = file.replace(".html", "");
          return {
            from: new RegExp(`/${name}`),
            to: `/${file}`,
          };
        }),
      })
    );
    app.use(express.static(folder));
    app.listen(PORT, () => {
      console.log(chalk.green(`Serving to 👉🏻 http://127.0.0.1:${PORT}`));
    });
  } catch (err) {
    console.log(chalk.red(err));
  }
};

export default serve;
