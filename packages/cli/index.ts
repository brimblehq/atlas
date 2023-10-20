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
  list,
  env,
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
  .option("--host <host>", "host to serve on")
  .option("-o, --open", "open the browser")
  .option("-i, --install", "install the packages only")
  .option("-b, --build", "build the project only")
  .option("-s, --start", "start the server only")
  .option("--watch", "watch and restart on file changes")
  .option("--build-command <buildCommand>", "build command")
  .option("--output-directory <outputDirectory>", "output directory")
  .option("--use-bun", "use bun instead of yarn")
  .action(serve);

program
  .command("login")
  .description("Login to Brimble cloud")
  .option("-e, --email <email>", "email")
  .option("-a --auth <auth>", "auth type")
  .action(login);

program
  .command("cook [directory]")
  .description("Deploy your project to Brimble cloud")
  .option("-o, --open", "open the browser")
  .option("-n, --name <name>", "name of the project")
  .option("-pID, --projectID <projectID>", "project ID")
  .option("-d, --domain <domain>", "add your custom domain")
  .option("-s --silent", "silent mode")
  .action(deploy);

program.command("logs").description("View your deploy logs").action(logs);

program.command("delete").description("Delete your project").action(remove);

const domain = program.command("domains").description("Domain commands");
domain
  .command("list [name]")
  .description("List your domains connected to your project")
  .action(domains);
domain
  .command("add <domain>")
  .description("Add a custom domain to your project")
  .action(domains);
domain
  .command("delete <domain>")
  .description("Remove a custom domain")
  .action(domains);

program
  .command("whoami")
  .description("View your Brimble account details")
  .action(whoami);

program
  .command("logout")
  .description("Logout from Brimble cloud")
  .action(logout);

program
  .command("list")
  .alias("ls")
  .description("List your projects")
  .action(list);

const environment = program.command("env").description("Environment commands");
environment
  .command("list [name]")
  .description("List your environment variables connected to your project")
  .action(env);
environment
  .command("add [name]")
  .description("Add an env to your project")
  .action(env);
environment
  .command("delete <environment>")
  .description("Remove an env from your project")
  .action(env);

program.parse();
