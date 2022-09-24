import logger from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
  ignore: "pid,hostname,time",
});
const log = logger(stream);

export default log;
