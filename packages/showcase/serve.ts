import chalk from "chalk";
import fs from "fs";
import express from "express";
import getPort from "get-port";
import history from "connect-history-api-fallback";

// Function to get all files
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
      arrayOfFiles.push(`${folder}/${file.name}`.split("./").join(""));
    }
  });

  return arrayOfFiles;
};

const serve = async (folder: string = ".") => {
  try {
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
        const name = file.replace(".html", "");
        return {
          from: new RegExp(`/${name}`),
          to: `${file}`,
        };
      }),
    ];

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
