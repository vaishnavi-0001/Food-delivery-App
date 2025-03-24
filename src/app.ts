import  express, {NextFunction, Request, Response} from "express";
import logger from "./config/logger";
import "reflect-metadata";
import  { HttpError } from "http-errors";
import { error } from "console";
import authRouter from "./routes/auth"

const app = express()

app.use(express.json());

app.get('/', (req, res) => {
   res.send("Welcome to auth service")
})

app.use('/auth', authRouter)


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
export default app;