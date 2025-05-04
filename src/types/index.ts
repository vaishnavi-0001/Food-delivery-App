// types.ts
import { Request } from "express"

export interface RegisterUserRequest extends Request {
      body: {
            firstName: string
            lastName: string
            email: string
            password: string
      }
}

export interface AuthRequest extends Request {
      body: {
            email?: string
            password?: string
            // ... other auth related body properties
      }
      auth?: {
            // If you are using a middleware to populate auth
            sub: string
            role: string
            id?: number // Example for refresh token id
      }
}
