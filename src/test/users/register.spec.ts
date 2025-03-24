import request from "supertest";
import app from "../../app";
import { User } from "../../entity/User";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { truncate } from "fs";
import { truncateTables } from "../utils";

describe("POST / auth/register", () => {
    let connection : DataSource;

    beforeAll( async()=> {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async() =>{
        //Database Truncate
        await truncateTables(connection);
    })

    afterAll(async ()=>{
        await connection.destroy();
    })

    describe("Given Fields", () => {
        it("should return 201 status code", async () => {
            //AAA(arrange, act, assert)
            const userdata = {
                firstName : "Navi",
                lastName : "Goyal",
                email : "navi@gmail.com",
                password : "secret",
            }

            const response = await request(app as any)
                    .post("/auth/register")
                    .send(userdata)

            expect(response.statusCode).toBe(201);
        })

        it("should return valid json response", async() => {
            const userdata = {
                firstName : "Navi",
                lastName : "Goyal",
                email : "navi@gmail.com",
                password : "secret",
            }

            //Act
            const response = await request(app as any)
                    .post("/auth/register")
                    .send(userdata)


            //Assert
            expect((response.headers as Record<string,string>)['content-type'])
                    .toEqual(expect.stringContaining('json'))
        });

        it("should persist the user in the database", async() =>{
            //Arrange
            const userData = {
                firstName : "Navi",
                lastName : "Goyal",
                email : "navi@gmail.com",
                password : "secret",
            }
            //Act
            
           await request(app as any)
                    .post("/auth/register")
                    .send(userData)
            
            //Assert 
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
            
        });
    });
    describe("Missing path", () => {})
});