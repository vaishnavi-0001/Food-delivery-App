import { DataSource } from "typeorm";
import request from "supertest";
import { createJWKSMock } from "mock-jwks";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import { Tenant } from "../../src/entity/Tenant";
import { createTenant } from "../utils";

describe("POST /users", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let stopJWKS: () => void;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        stopJWKS = await jwks.start();
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Reset database before each test
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        if (stopJWKS) stopJWKS();
        if (connection?.destroy) await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should persist the user in the database", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const userData = {
                firstName: "Navi",
                lastName: "Goyal",
                email: "navi@gmail.com",
                password: "secret",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };

            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(userData.email);
        });

        it("should create a manager user", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const userData = {
                firstName: "Navi",
                lastName: "Goyal",
                email: "navi@gmail.com",
                password: "secret",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };

            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
        });

        it("should return 403 if non admin user tries to create a user", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));

            const nonAdminToken = jwks.token({
                sub: "1",
                role: Roles.MANAGER,
            });

            const userData = {
                firstName: "Navi",
                lastName: "Goyal",
                email: "navi@gmail.com",
                password: "secret",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };

            const response = await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${nonAdminToken}`])
                .send(userData);

            expect(response.statusCode).toBe(403);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
        });
    });
});
