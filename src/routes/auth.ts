import express, { NextFunction, Request, Response } from "express"

import { AuthController } from "../controllers/AuthController"
import { UserService } from "../services/UserService"
import { AppDataSource } from "../config/data-source"
import { User } from "../entity/User"
import logger from "../config/logger";
import registerValidator from "../validator/register-validator"

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authcontroller = new AuthController(userService, logger);

router.post(
      "/register",
      registerValidator,
      (req: Request, res: Response, next: NextFunction) =>
            AuthController.register(req, res, next),
);

export default router;
