import { NextFunction, Request, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";



export class AuthController {
      static register(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction): void | Promise<void> {
            throw new Error("Method not implemented.");
      }
      constructor(
            private userService: UserService,
            private logger: Logger,
      ) {}

      async register(
            req: RegisterUserRequest,
            res: Response,
            next: NextFunction,
      ) {
           //validation
            const result = validationResult(req);
            if (!result.isEmpty()) {
              return res.status(400).json({errors : result.array() });
            }
            
            const { firstName, lastName, email, password } = req.body;
            this.logger.debug("New request to register a user", {
                  firstName,
                  lastName,
                  email,
                  password: "*******",
            })

            try {
                  const user = await this.userService.create({
                        firstName,
                        lastName,
                        email,
                        password,
                  });
                  this.logger.info("User has been registered", { id: user.id })

                  res.status(201).json({ id: user.id })
            } catch (err) {
                  next(err)
                  return;
            }
      }
}
