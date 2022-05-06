#!/usr/bin/env node
import { Command } from "commander";
import pkg from "./package.json";
import serve from "./serve";
import deploy from "./deploy";
import dotenv from "dotenv";

dotenv.config();

const program = new Command();

program
  .name("brimble")
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "output the version number");

program
  .command("dev [directory]")
  .description("Preview your awesome project locally")
  .option("-p, --port <port>", "port to serve on", parseInt)
  .option("-o, --open", "open the browser")
  .option("-d, --deploy", "deploy to Brimble")
  .action(serve);

program
  .command("cook [directory]")
  .description("Deploy your project to Brimble cloud")
  .option("-o, --open", "open the browser")
  .action(deploy);

program.parse();
