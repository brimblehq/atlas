import winston, { LoggerOptions } from "winston";

const defaultOptions = {
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.json() }),
  ],
};
const createLogger = (options?: LoggerOptions) => {
  return winston.createLogger({ ...defaultOptions, ...options });
};

const log = createLogger();
export { createLogger, log };
