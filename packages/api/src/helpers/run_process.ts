#!/usr/bin/env node
import { PusherService } from "@/services";
import { spawn } from "child_process";

const run_process = async () => {
  const child = spawn("yarn");

  child.stdout.on("data", (data) => {
    PusherService.consoleEventTrigger(`${data}`);
    console.log(`stdout:\n${data}`);
  });

  child.stderr.on("data", (data) => {
    PusherService.consoleEventTrigger(`${data}`);
    console.error(`stderr: ${data}`);
  });

  child.on("error", (error) => {
    PusherService.consoleEventTrigger(error);
    console.error(`error: ${error.message}`);
  });

  child.on("close", (code) => {
    PusherService.consoleEventTrigger(code);
    console.log(`child process exited with code ${code}`);
  });

  return child;
};

export { run_process };
