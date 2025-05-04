import app from "./app"

const startServer = async () => {
      // Importing inside the function to avoid circular dependency issues
      const { Config } = await import("./config")
      const { AppDataSource } = await import("./config/data-source")
      const logger = (await import("./config/logger")).default

      const PORT = Config.PORT

      try {
            await AppDataSource.initialize()
            logger.info("Database Connected Successfully.")
            app.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
      } catch (err: unknown) {
            if (err instanceof Error) {
                  logger.error(err.message)
                  setTimeout(() => {
                        process.exit(1)
                  }, 1000)
            }
      }
}
