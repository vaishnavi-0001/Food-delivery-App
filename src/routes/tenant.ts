import express, { NextFunction, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import tenantValidator from "../validator/tenant-validator";
import { CreateTenantRequest } from "../types";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        try {
            await tenantController.create(req, res, next);
        } catch (error) {
            next(error);
        }
    },
);

router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        try {
            await tenantController.update(req, res, next);
        } catch (error) {
            next(error);
        }
    },
);
router.get("/", (req, res, next) => tenantController.getAll(req, res, next));
router.get("/:id", (req, res, next) => tenantController.getOne(req, res, next));
router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.destroy(req, res, next),
);

export default router;