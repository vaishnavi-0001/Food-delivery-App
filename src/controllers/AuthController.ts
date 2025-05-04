import { NextFunction, Request, Response } from "express"
import { JwtPayload } from "jsonwebtoken"
import { RegisterUserRequest } from "../types"
import { UserService } from "../services/UserService"
import { Logger } from "winston"
import { TokenService } from "../services/TokenService"
import { ParamsDictionary } from "express-serve-static-core"
import { ParsedQs } from "qs"
import createHttpError from "http-errors"
import { Roles } from "../constants"
import { CredentialService } from "../services/CredentialService"
// import { AppDataSource } from "../config/data-source"

const { validationResult } = require("express-validator")

export class AuthController {
      static login(
            //validation
            req: Request<
                  ParamsDictionary,
                  any,
                  any,
                  ParsedQs,
                  Record<string, any>
            >,
            res: Response<any, Record<string, any>>,
            next: NextFunction,
      ): void | Promise<void> {
            throw new Error("Method not implemented.")
      }
      static register(
            req: Request<
                  ParamsDictionary,
                  any,
                  any,
                  ParsedQs,
                  Record<string, any>
            >,
            res: Response<any, Record<string, any>>,
            next: NextFunction,
      ): void | Promise<void> {
            throw new Error("Method not implemented.")
      }

      constructor(
            private userService: UserService,
            private logger: Logger,
            private tokenService: TokenService,
            private credentialService: CredentialService,
      ) {}

      async register(
            req: RegisterUserRequest,
            res: Response,
            next: NextFunction,
      ) {
            // Validation
            const result = validationResult(req)
            if (!result.isEmpty()) {
                  return res.status(400).json({ errors: result.array() })
            }
            const { firstName, lastName, email, password } = req.body

            this.logger.debug("New request to register a user", {
                  firstName,
                  lastName,
                  email,
                  password: "******",
            })
            try {
                  const user = await this.userService.create({
                        firstName,
                        lastName,
                        email,
                        password,
                        role: Roles.CUSTOMER,
                  })
                  this.logger.info("User has been registered", { id: user.id })

                  const payload: JwtPayload = {
                        sub: String(user.id),
                        role: user.role,
                  }

                  const accessToken =
                        this.tokenService.generateAccessToken(payload)

                  // Persist the refresh token
                  const newRefreshToken =
                        await this.tokenService.persistRefreshToken(user)

                  const refreshToken = this.tokenService.generateRefreshToken({
                        ...payload,
                        id: String(newRefreshToken.id),
                  })

                  res.cookie("accessToken", accessToken, {
                        domain: "localhost",
                        sameSite: "strict",
                        maxAge: 1000 * 60 * 60, // 1h
                        httpOnly: true, // Very important
                  })

                  res.cookie("refreshToken", refreshToken, {
                        domain: "localhost",
                        sameSite: "strict",
                        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                        httpOnly: true, // Very important
                  })

                  res.status(201).json({ id: user.id })
            } catch (err) {
                  next(err)
                  return
            }
      }

      async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
            // Validation
            const result = validationResult(req)
            if (!result.isEmpty()) {
                  return res.status(400).json({ errors: result.array() })
            }
            const { email, password } = req.body

            this.logger.debug("New request to login a user", {
                  email,
                  password: "******",
            })

            try {
                  const user = await this.userService.findByEmail(email)
                  if (!user) {
                        const error = createHttpError(
                              400,
                              "Email or password does not match.",
                        )
                        next(error)
                        return
                  }

                  const passwordMatch =
                        await this.credentialService.comparePassword(
                              password,
                              user.password,
                        )

                  if (!passwordMatch) {
                        const error = createHttpError(
                              400,
                              "Email or password does not match.",
                        )
                        next(error)
                        return
                  }

                  const payload: JwtPayload = {
                        sub: String(user.id),
                        role: user.role,
                  }

                  const accessToken =
                        this.tokenService.generateAccessToken(payload)

                  // Persist the refresh token
                  const newRefreshToken =
                        await this.tokenService.persistRefreshToken(user)

                  const refreshToken = this.tokenService.generateRefreshToken({
                        ...payload,
                        id: String(newRefreshToken.id),
                  })

                  res.cookie("accessToken", accessToken, {
                        domain: "localhost",
                        sameSite: "strict",
                        maxAge: 1000 * 60 * 60, // 1h
                        httpOnly: true, // Very important
                  })

                  res.cookie("refreshToken", refreshToken, {
                        domain: "localhost",
                        sameSite: "strict",
                        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                        httpOnly: true, // Very important
                  })

                  this.logger.info("User has been logged in", { id: user.id })
                  res.json({ id: user.id })
            } catch (err) {
                  next(err)
                  return
            }
      }
}
