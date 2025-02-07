import { beforeEach, describe } from "node:test";
import { afterAll, beforeAll, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import { createUserAndGetCookies } from "./utils/createUserAndGetCookies";

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

  it("should be able to create a new meal", async () => {
    const cookies = await createUserAndGetCookies(app);

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

  it("should be able to list meals", async () => {
    const cookies = await createUserAndGetCookies(app);

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

    const mealsListResponse = await request(app.server)
      .get(`/meals/list/${cookies[0].replace("sessionId=", "").split(";")[0]}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(mealsListResponse.body.data).toEqual([
      expect.objectContaining({
        name: "Janta",
        description: "Arroz, Feijão e Frango",
        datetime: "2024-02-05T15:30:00Z",
        diet: 0,
      }),
    ]);
  });
});
