import  express, {NextFunction, Request, Response} from "express";
import logger from "./config/logger";
import  { HttpError } from "http-errors";
import { error } from "console";

export const app = express()



app.get('/', (req, res,) => {
  
   res.send("Welcome to auth service")
})

//Global error handler must be in last
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
   logger.error(err.message)
   const statusCode =err.statusCode || 500

   res.status(statusCode).json({
      errors:[
         {
            type: err.name,
            msg: err.message,
            path: '',
            location:'',
         }
      ]
   })
})
export default app