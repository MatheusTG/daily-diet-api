import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import { knex } from "../src/database";

describe("Users routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new user", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "Amanda",
      })
      .expect(201);
  });

  it("should be able to fetch a user", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Amanda",
      })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    if (!cookies) throw new Error("Cookies do not exists!");

    await request(app.server).get("/users").set("Cookie", cookies).expect(200);
  });
});
