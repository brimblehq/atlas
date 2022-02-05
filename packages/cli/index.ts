#!/usr/bin/env node
import { Command } from "commander";
import pkg from "./package.json";
import serve from "./serve";

const program = new Command();

program.version(pkg.version, "-v, --version", "output the version number");

program
  .description(pkg.description)
  .argument("[folder]", "path to the directory")
  .action(serve)
  .parse();
