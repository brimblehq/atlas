import { log } from "@brimble/utils";
import chalk from "chalk";
import chokidar from "chokidar";
import Conf from "configstore";
import { getIgnoredFiles } from "../helpers";

const watch = (directory: string, options: { projectID: string }) => {
  const config = new Conf("brimble");
  const projectID = options.projectID;
  const project: { changedFiles: string[]; projectID: number; name: string } =
    config.get(projectID);

  if (!project) {
    log.error(chalk.red(`Project ${projectID} not found`));
    process.exit(1);
  }

  const watcher = chokidar.watch(directory, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher
    .on("add", async (file: string) => {
      const ignoredFiles = await getIgnoredFiles(directory);

      let changedFiles = project.changedFiles || [];
      changedFiles.push(file);

      ignoredFiles.forEach((file: string) => {
        changedFiles = changedFiles.filter((f) => !f.includes(file));
      });

      project.changedFiles = [...new Set(changedFiles)];
      config.set(project.name, project);
    })
    .on("change", async (file: string) => {
      const ignoredFiles = await getIgnoredFiles(directory);

      let changedFiles = project.changedFiles || [];
      changedFiles.push(file);

      ignoredFiles.forEach((file: string) => {
        changedFiles = changedFiles.filter((f) => !f.includes(file));
      });

      project.changedFiles = [...new Set(changedFiles)];
      config.set(project.name, project);
    });
};

export default watch;
