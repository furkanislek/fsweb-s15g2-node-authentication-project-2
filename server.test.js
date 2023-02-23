const request = require("supertest");
const server = require("./api/server");
const db = require("./data/db-config");


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("post", () => {
  describe("post auth/login", () => {
    it("returns 200 status code ", async () => {
      const expectedStatusCode = 200;
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "bob", password: "1234" });
      expect(res.status).toBe(expectedStatusCode);
    });
  });

  describe("post auth/login 2", () => {
    it("returns correct message", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "bob", password: "1234" });
      expect(res.body.message).toBe("bob geri geldi!");
    });
  });

  describe("post auth/login 3", () => {
    it("returns false message", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "foo", password: "bar" });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Geçersiz kriter");
    });
  });
});

describe("Post Register", () => {
  describe("post /api/auth/register", () => {
    it("post auth/register", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "bradpitt", password: "9876" });
      const newUser = await db("users").where("username", "bradpitt").first();
      expect(newUser).toMatchObject({ username: "bradpitt" });
    });
  });

  describe("post /api/auth/register 2", () => {
    it("post auth/register", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "bradpitt2", password: "9876" });

      expect(res.status).toBe(201);
    });
  });
});
