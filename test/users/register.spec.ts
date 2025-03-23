import request from "supertest";
import app from "../../src/app";

describe("POST / auth/register", () => {
    describe("Given Fields", () => {
        it("should return 201 status code", async () => {
            //AAA(arrange, act, assert)
            const userdata = {
                FirstName : "Navi",
                Lastname : "Goyal",
                email : "navi@gmail.com",
                password : "secret",
            }

            const response = await request(app)
                    .post("/auth/register")
                    .send(userdata)

            expect(response.statusCode).toBe(201);
        })

        it("should return valid json response", async() => {
            const userdata = {
                FirstName : "Navi",
                Lastname : "Goyal",
                email : "navi@gmail.com",
                password : "secret",
            }

            //Act
            const response = await request(app)
                    .post("/auth/register")
                    .send(userdata)


            //Assert
            expect((response.headers as Record<string,string>)['content-type'])
                    .toEqual(expect.stringContaining('json'))
        });

        it("should persist the user in the database", async() =>{
            const userdata = {
                FirstName : "Navi",
                Lastname : "Goyal",
                email : "navi@gmail.com",
                password : "secret",
            }

            const response = await request(app)
                    .post("/auth/register")
                    .send(userdata)
            
            
        })
    });
    describe("Missing path", () => {})
});