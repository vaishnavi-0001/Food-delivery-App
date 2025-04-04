import { Repository } from "typeorm"
import bcrypt from 'bcrypt';
import { User } from "../entity/User"
import { UserData } from "../types"
import createHttpError from "http-errors"
import { Roles } from "../constants"

export class UserService {
      constructor(private userRepository: Repository<User>) {}
      async create({ firstName, lastName, email, password }: UserData) {

            const user = await this.userRepository.findOne({where: {email: email}});
            if(user) {
                  const err = createHttpError(400, "Email already exists");
                  throw err;
            }
            //Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            

            try {
                  return await this.userRepository.save({
                        firstName,
                        lastName,
                        email,
                        password : hashedPassword,
                        role :Roles.CUSTOMER,
                  })
            } catch (err) {
                  const error = createHttpError(
                        500,
                        "Failed to store data in DB",
                  )
                  throw error
            }
      }
}
