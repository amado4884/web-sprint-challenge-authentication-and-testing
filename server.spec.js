const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();
const server = require("./api/server.js");
const { v4: uuid } = require("uuid");

describe("server.js", () => {
  describe("auth", () => {
    it("/register - should return a 500 (user already exists)", async () => {
      const expectedStatusCode = 500;
      const message = { message: "That user already exists" };

      const response = await request(server)
        .post("/api/auth/register")
        .send({ username: "amado", password: "amado" });

      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toEqual(message);
    });

    it("/register - should return an OK status code", async () => {
      const expectedStatusCode = 200;
      const message = {
        message: "You have registered, you can now log in.",
      };

      const response = await request(server)
        .post("/api/auth/register")
        .send({ username: uuid(), password: uuid() });

      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toEqual(message);
    });

    it("/login - should return an OK status code", async () => {
      const expectedStatusCode = 200;

      const response = await request(server)
        .post("/api/auth/login")
        .send({ username: "amado", password: "amado" });

      expect(response.status).toEqual(expectedStatusCode);
    });

    it("/login - should return an 400 (bad password)", async () => {
      const expectedStatusCode = 400;

      const response = await request(server)
        .post("/api/auth/login")
        .send({ username: "amado", password: "amado1" });

      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("users", () => {
    it("/ - should return a 401 (no token)", async () => {
      const expectedStatusCode = 401;

      const response = await request(server).post("/api/users");

      expect(response.status).toEqual(expectedStatusCode);
    });

    it("/users - should login and return 200", async () => {
      const expectedStatusCode = 200;

      const loginResponse = await request(server)
        .post("/api/auth/login")
        .send({ username: "amado", password: "amado" });
      expect(loginResponse.status).toEqual(expectedStatusCode);
      const { token } = loginResponse.body;

      const response = await request(server)
        .get("/api/users")
        .set("Authorization", token);
      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("jokes", () => {
    it("/ - should return a 401 (no token)", async () => {
      const expectedStatusCode = 401;

      const response = await request(server).post("/api/jokes");

      expect(response.status).toEqual(expectedStatusCode);
    });

    it("/jokes - should login and return 200", async () => {
      const expectedStatusCode = 200;

      const loginResponse = await request(server)
        .post("/api/auth/login")
        .send({ username: "amado", password: "amado" });
      expect(loginResponse.status).toEqual(expectedStatusCode);
      const { token } = loginResponse.body;

      const response = await request(server)
        .get("/api/jokes")
        .set("Authorization", token);
      expect(response.status).toEqual(expectedStatusCode);
    });
  });
});
