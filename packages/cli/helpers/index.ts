import path from "path";
import fs from "fs";

// check if file is a directory and return all files in it with previous directory
export const getFiles = (file: string, previous: string = "") => {
  const filePath = path.resolve(previous, file);
  if (fs.lstatSync(filePath).isDirectory()) {
    return fs.readdirSync(filePath).reduce((acc, file): any => {
      return [...acc, ...getFiles(file, filePath)];
    }, []);
  }
  return [filePath];
};

export const dirValidator = (directory: string) => {
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

  return { folder, files };
};
