#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import updateNotifier from "update-notifier";
import chalk from "chalk";
import pkg from "./package.json";
import {
  deploy,
  domains,
  login,
  logs,
  remove,
  serve,
  whoami,
  logout,
} from "./commands";

dotenv.config();

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24, // 1 day
});

notifier.notify();

if (notifier.update) {
  const { latest } = notifier.update;
  console.log(
    chalk.yellow(
      `A newer version of Brimble CLI is available: ${latest}
  You are currently on ${pkg.version}
  Run ${chalk.green(`yarn global add @brimble/cli`)} to update.`
    )
  );
}

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
  .option("-so, --start-only", "start the server only")
  .option("--build-command <buildCommand>", "build command")
  .option("--output-directory <outputDirectory>", "output directory")
  .action(serve);

program
  .command("login")
  .description("Login to Brimble cloud")
  .option("-e, --email <email>", "email")
  .action(login);

program
  .command("cook [directory]")
  .description("Deploy your project to Brimble cloud")
  .option("-o, --open", "open the browser")
  .option("-n, --name <name>", "name of the project")
  .option("-d, --domain <domain>", "add your custom domain")
  .option("-pID, --projectID <projectID>", "add your project ID (optional)")
  .option("-s --silent", "silent mode")
  .action(deploy);

program
  .command("logs <id|name>")
  .description("View your deploy logs")
  .action(logs);

program
  .command("delete <id|name>")
  .description("Delete your project")
  .action(remove);

program
  .command("domains <id|name>")
  .description("View your domains connected to your project")
  .action(domains);

program
  .command("whoami")
  .description("View your Brimble account details")
  .action(whoami);

program
  .command("logout")
  .description("Logout from Brimble cloud")
  .action(logout);

program.parse();
