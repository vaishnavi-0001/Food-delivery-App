import express, { NextFunction, Response } from "express";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import createUserValidator from "../validator/create-user-validator";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import updateUserValidator from "../validator/update-user-validator";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    async (req: CreateUserRequest, res: Response, next: NextFunction) => {
        try {
            await userController.create(req, res, next);
        } catch (error) {
            next(error);
        }
    },
);

router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        try {
            await userController.update(req, res, next);
        } catch (error) {
            next(error);
        }
    },
);

router.get("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getAll(req, res, next),
);

router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getOne(req, res, next),
);

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.destroy(req, res, next),
);

export default router;