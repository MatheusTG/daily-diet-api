import { beforeEach, describe } from "node:test";
import { afterAll, beforeAll, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";

describe("Meals routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync("npm run knex -- migrate:rollback --all");
    execSync("npm run knex -- migrate:latest");
  });

  it.only("should be able to create a new meal", async () => {
    const userCreateResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Amanda",
      })
      .expect(201);

    const cookies = userCreateResponse.get("Set-Cookie");

    if (!cookies) throw new Error("Cookies do not exists!");

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Arroz, Feijão e Frango",
        datetime: "2024-02-05T15:30:00Z",
        diet: false,
      })
      .expect(201);
  });
});
