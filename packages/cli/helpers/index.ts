import path from "path";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import https from "https";
import { io } from "socket.io-client";
import chalk from "chalk";
import glob from "glob";
import simpleGit from "simple-git";
import gitIgnoreParser from "parse-gitignore";
import Conf from "configstore";
dotenv.config();

export const API_URL = process.env.API_URL || "https://api.brimble.io";
export const FEEDBACK_MESSAGE = `Got a bug or a suggestion? Please report it on ${chalk.bold(
  "https://bit.ly/3cE7iZu"
)} or create an issue on GitHub: ${chalk.bold(
  "https://github.com/brimblehq/brimble/issues"
)}`;

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
    throw new Error(`This folder ("${directory}") doesn't contain index.html or package.json`);
  }

  return { folder, files };
};

// setup axios
export const setupAxios = (token: string = "") => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
  });
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    httpsAgent,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return instance;
};

export const msToTime = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours}h:${minutes}m:${seconds}s`;
};

export const socket = io(API_URL);

export const git = simpleGit();
export const getGitIgnore = async (folder: string) => {
  let gitignore = path.resolve(folder, ".gitignore");
  if (!fs.existsSync(gitignore)) {
    const gitDir = await git.revparse(["--git-dir"]);

    if (gitDir.trim() === "") {
      return false;
    }
    gitignore = path.resolve(gitDir.split(".git").join(""), ".gitignore");

    if (!fs.existsSync(gitignore)) {
      return false;
    }
  }
  return gitignore;
};

export const getIgnoredFiles = async (folder: string) => {
  const gitignore = await getGitIgnore(folder);

  if (!gitignore) {
    return [];
  }

  const files: any = gitIgnoreParser(fs.readFileSync(gitignore, "utf8"));

  let ignoredFiles = files?.patterns.reduce((acc: any, file: any) => {
    return [...acc, ...glob.sync(file.replace(/\//g, ""))];
  }, []);

  if (ignoredFiles.length) {
    ignoredFiles = ignoredFiles.reduce((acc: any, file: any) => {
      if (fs.lstatSync(file).isDirectory()) {
        return [...acc, `${file}/`, `${file}\\`, ".git/", ".git\\"];
      }
      return [...acc, file, ".git/", ".git\\"];
    }, []);
  }

  return ignoredFiles;
};

export const projectConfig = async () => {
  const config = new Conf(
    "brimble",
    { project: {} },
    {
      configPath: path.join(process.cwd(), "brimble.json"),
    }
  );

  const gitignore = await getGitIgnore(process.cwd());

  if (gitignore) {
    const files = fs.readFileSync(gitignore, "utf8");
    if (!files.includes("brimble.json")) {
      fs.appendFileSync(gitignore, "\nbrimble.json");
    }
  } else {
    fs.writeFileSync(
      path.join(process.cwd(), ".gitignore"),
      "brimble.json\n",
      "utf8"
    );
  }

  return config;
};

export const isLoggedIn = () => {
  const config = new Conf("brimble");
  const user = config.get("user");
  if (!user || !user.token) {
    config.clear();
    return false;
  }
  return user;
};
