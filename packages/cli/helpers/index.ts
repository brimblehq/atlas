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
