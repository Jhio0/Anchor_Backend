// logger.d.ts

import type { Logger } from "pino";

/**
 * Configured Pino logger instance.
 * Automatically sets level from LOG_LEVEL and uses pretty-print in development.
 */
declare const logger: Logger;

export default logger;
