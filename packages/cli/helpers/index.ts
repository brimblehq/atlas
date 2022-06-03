import path from "path";
import fs from "fs";
import axios from "axios";
import pusherJs from "pusher-js";
import dotenv from "dotenv";
import https from "https";
import { createClient } from "redis";
dotenv.config();

const API_URL = process.env.API_URL || "https://api.brimble.io";

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

// setup axios
export const setupAxios = (token: string = "") => {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    httpsAgent,
  });

  return instance;
};

// setup pusherJs
export const pusherClient = new pusherJs(
  process.env.PUSHER_APP_KEY || "5dff174783932f54aebc",
  {
    cluster: "eu",
    channelAuthorization: {
      endpoint: `${API_URL}/pusher/auth`,
    } as any,
  }
);

export const redisClient = async () => {
  const { data } = await setupAxios()
    .get("/config")
    .catch((err) => err);

  if (data) {
    const client = createClient({
      url: data.config.redisUrl,
    });
    const subscriber = client.duplicate();
    await subscriber.connect();
    return { client, subscriber };
  } else {
    throw new Error("Error connecting to redis");
  }
};
