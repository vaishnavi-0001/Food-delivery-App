import winston from "winston"
import { Config } from "."
console.log("Loading logger.ts...");
// Or loading data-source.ts etc.

const logger = winston.createLogger({
      level: "info",
      defaultMeta: {
            serviceName: "food-delivery-service",
      },
      format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
      ),
      transports: [
            new winston.transports.File({
                  dirname: "logs",
                  filename: "combined.log",
                  level: "info",
                  silent: Config.NODE_ENV === "test",
            }),
            new winston.transports.File({
                  dirname: "logs",
                  filename: "error.log",
                  level: "error",
                  silent: Config.NODE_ENV === "test",
            }),
            new winston.transports.Console({
                  level: "info",
                  silent: Config.NODE_ENV === "test",
            }),
      ],
})

export default logger
