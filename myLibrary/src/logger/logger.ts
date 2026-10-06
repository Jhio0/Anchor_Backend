import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info", // log level
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty", // human-readable logs
          options: {
            colorize: true,
          },
        }
      : undefined,
});

export default logger;
