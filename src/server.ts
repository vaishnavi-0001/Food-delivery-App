// import app from "./app";
// import { Config } from "./config";
// import { AppDataSource } from "./config/data-source";
// import logger from "./config/logger";


// const startServer = async () => {
//     const PORT = Config.PORT;
//     try {
//         await AppDataSource.initialize();
//         logger.info("Database connected successfully.");
//         app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
//     } catch (err: unknown) {
//         if (err instanceof Error) {
//             logger.error(err.message);
//             setTimeout(() => {
//                 process.exit(1);
//             }, 1000);
//         }
//     }
// };

// void startServer();

console.log("App starting...");

// Comment everything
// import logger from "./config/logger";
// import { AppDataSource } from "./config/data-source";
// import authRouter from "./routes/auth";
// import tenantRouter from "./routes/tenant";
// import userRouter from "./routes/user";

import express from "express";
const app = express();

// app.get("/", (_, res) => res.send("OK!"));

app.listen(3000, () => console.log("Server running on 3000"));
