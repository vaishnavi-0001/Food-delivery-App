import request from "supertest"
import app from "../../app"
import { User } from "../../entity/User"
import { DataSource } from "typeorm"
import { AppDataSource } from "../../config/data-source"
import { Roles } from "../../constants"
import exp from "constants"
import { Handler } from "express"
import { isJwt } from "../utils"

describe("POST / auth/register", () => {
      let connection: DataSource

      beforeAll(async () => {
            connection = await AppDataSource.initialize()
      })

      beforeEach(async () => {
            //Database Truncate
            await connection.dropDatabase()
            await connection.synchronize()
      })

      afterAll(async () => {
            await connection.destroy()
      })

      describe("Given Fields", () => {
            it("should return 201 status code", async () => {
                  //AAA(arrange, act, assert)
                  const userdata = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: "navi@gmail.com",
                        password: "secret",
                  }

                  const response = await request(app as any)
                        .post("/auth/register")
                        .send(userdata)

                  expect(response.statusCode).toBe(201)
            });

            it("should return valid json response", async () => {
                  const userdata = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: "navi@gmail.com",
                        password: "secret",
                  }

                  //Act
                  const response = await request(app as any)
                        .post("/auth/register")
                        .send(userdata)

                  //Assert
                  expect(
                        (response.headers as Record<string, string>)[
                              "content-type"
                        ],
                  ).toEqual(expect.stringContaining("json"))
            });

            it("should persist the user in the database", async () => {
                  //Arrange
                  const userData = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: "navi@gmail.com",
                        password: "secret",
                  }
                  //Act

                  await request(app as any)
                        .post("/auth/register")
                        .send(userData)

                  //Assert
                  const userRepository = connection.getRepository(User)
                  const users = await userRepository.find()
                  expect(users).toHaveLength(1)
                  expect(users[0].firstName).toBe(userData.firstName)
                  expect(users[0].lastName).toBe(userData.lastName)
                  expect(users[0].email).toBe(userData.email)
            });

            it("should return an id of the created user", async () => {
                // Arrange
                const userData = {
                    firstName: "Rakesh",
                    lastName: "K",
                    email: "rakesh@mern.space",
                    password: "password",
                };
                // Act
                const response = await request(app as any)
                    .post("/auth/register")
                    .send(userData);
    
                // Assert
                expect(response.body).toHaveProperty("id");
                const repository = connection.getRepository(User);
                const users = await repository.find();
                expect((response.body as Record<string, string>).id).toBe(
                    users[0].id,
                );
            });

            it("should assign a customer role", async () => {
                  //Arrange
                  const userData = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: "navi@gmail.com",
                        password: "secret",
                  }
                  //Act

                  await request(app as any)
                        .post("/auth/register")
                        .send(userData)

                  //Assert
                  const userRepository = connection.getRepository(User)
                  const users = await userRepository.find()
                  expect(users[0]).toHaveProperty("role")
                  expect(users[0].role).toBe(Roles.CUSTOMER)
            });

            it("Should store the password in DB", async () => {
                  //Arrange
                  const userData = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: "navi@gmail.com",
                        password: "secret",
                  }
                  //Act

                  await request(app as any)
                        .post("/auth/register")
                        .send(userData)

                  //Assert
                  const userRepository = connection.getRepository(User)
                  const users = await userRepository.find()
                  expect(users[0].password).not.toBe(userData.password)
                  expect(users[0].password).toHaveLength(60)
                  expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
            });

            it("should return 400 status code if email already exists", async () => {
                  //Arrange
                  const userData = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: "navi@gmail.com",
                        password: "secret",
                  }
                  const userRepository = connection.getRepository(User)

                  await userRepository.save({
                        ...userData,
                        role: Roles.CUSTOMER,
                  })
                  //Act
                  const response = await request(app as any)
                        .post("/auth/register")
                        .send(userData)

                  const users = await userRepository.find()
                  //Assert
                  expect(response.statusCode).toBe(400)
                  expect(users).toHaveLength(1)
            })

            it("should return the access token and refresh token inside a cookie", async () => {
                  // Arrange
                  const userData = {
                      firstName: "Rakesh",
                      lastName: "K",
                      email: "rakesh@mern.space",
                      password: "password",
                  };
      
                  // Act
                  const response = await request(app as any)
                      .post("/auth/register")
                      .send(userData);
      
                  interface Headers {
                      ["set-cookie"]: string[];
                  }
                  // Assert
                  let accessToken = null;
                  let refreshToken = null;
                  const cookies = (response.headers as unknown as Headers)["set-cookie"] || [];
                  // accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjkzOTA5Mjc2LCJleHAiOjE2OTM5MDkzMzYsImlzcyI6Im1lcm5zcGFjZSJ9.KetQMEzY36vxhO6WKwSR-P_feRU1yI-nJtp6RhCEZQTPlQlmVsNTP7mO-qfCdBr0gszxHi9Jd1mqf-hGhfiK8BRA_Zy2CH9xpPTBud_luqLMvfPiz3gYR24jPjDxfZJscdhE_AIL6Uv2fxCKvLba17X0WbefJSy4rtx3ZyLkbnnbelIqu5J5_7lz4aIkHjt-rb_sBaoQ0l8wE5KzyDNy7mGUf7cI_yR8D8VlO7x9llbhvCHF8ts6YSBRBt_e2Mjg5txtfBaDq5auCTXQ2lmnJtMb75t1nAFu8KwQPrDYmwtGZDkHUcpQhlP7R-y3H99YnrWpXbP8Zr_oO67hWnoCSw; Max-Age=43200; Domain=localhost; Path=/; Expires=Tue, 05 Sep 2023 22:21:16 GMT; HttpOnly; SameSite=Strict
                  cookies.forEach((cookie) => {
                      if (cookie.startsWith("accessToken=")) {
                          accessToken = cookie.split(";")[0].split("=")[1];
                      }
      
                      if (cookie.startsWith("refreshToken=")) {
                          refreshToken = cookie.split(";")[0].split("=")[1];
                      }
                  });
                  expect(accessToken).not.toBeNull();
                  expect(refreshToken).not.toBeNull();
      
                  expect(isJwt(accessToken)).toBeTruthy();
                  expect(isJwt(refreshToken)).toBeTruthy();
              });
      });


      describe("Field are missing", () => {
            it("should return 400 status code if email field is missing", async () => {
                  //Arrange
                  const userData = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: "",
                        password: "secret",
                  }

                  //Act
                  const response = await request(app as any)
                        .post("/auth/register")
                        .send(userData)

                  //Assert
                  expect(response.statusCode).toBe(400)
                  const userRepository = connection.getRepository(User)
                  const users = await userRepository.find()

                  expect(users).toHaveLength(0)
            })


            it("should return 400 status code if firstName is missing", async () => {
                // Arrange
                const userData = {
                    firstName: "",
                    lastName: "K",
                    email: "rakesh@mern.space",
                    password: "password",
                };
                // Act
                const response = await request(app as any)
                    .post("/auth/register")
                    .send(userData);
    
                // Assert
                expect(response.statusCode).toBe(400);
                const userRepository = connection.getRepository(User);
                const users = await userRepository.find();
                expect(users).toHaveLength(0);
            });


            it("should return 400 status code if lastName is missing", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "",
                email: "rakesh@mern.space",
                password: "password",
            };
            // Act
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
            });


            it("should return 400 status code if password is missing", async () => {
                // Arrange
                const userData = {
                    firstName: "Rakesh",
                    lastName: "K",
                    email: "rakesh@mern.space",
                    password: "",
                };
                // Act
                const response = await request(app as any)
                    .post("/auth/register")
                    .send(userData);
    
                // Assert
                expect(response.statusCode).toBe(400);
                const userRepository = connection.getRepository(User);
                const users = await userRepository.find();
                expect(users).toHaveLength(0);
            });
      });


      describe("Fields are not in proper format", () => {
            it("Should trim the email fields", async () => {
                  //Arrange
                  const userData = {
                        firstName: "Navi",
                        lastName: "Goyal",
                        email: " navi@gmail.com ",
                        password: "secret",
                  }

                  //Act
                  await request(app as any)
                        .post("/auth/register")
                        .send(userData)

                  //Assert
                  const userRepository = connection.getRepository(User)
                  const users = await userRepository.find()

                  const user = users[0]
                  expect(user.email).toBe("navi@gmail.com")
            });

            it("should return 400 status code if email is not a valid email", async () => {
                // Arrange
                const userData = {
                    firstName: "Rakesh",
                    lastName: "K",
                    email: "rakesh_mern.space", // Invalid email
                    password: "password",
                };
                // Act
                const response = await request(app as any)
                    .post("/auth/register")
                    .send(userData);
    
                // Assert
                expect(response.statusCode).toBe(400);
                const userRepository = connection.getRepository(User);
                const users = await userRepository.find();
                expect(users).toHaveLength(0);
            });


            it("should return 400 status code if password length is less than 8 chars", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "pass", // less than 8 chars
            };
            // Act
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });


            it("shoud return an array of error messages if email is missing", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "",
                password: "password",
            };
            // Act
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty("errors");
            expect(
                (response.body as Record<string, string>).errors.length,
            ).toBeGreaterThan(0);
        });
      })
})
