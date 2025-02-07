import { beforeEach, describe } from "node:test";
import { afterAll, beforeAll, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import { createUserAndGetCookies } from "./utils/createUserAndGetCookies";
import { createMealAndReturnData } from "./utils/createMealAndReturnData";

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

    await createMealAndReturnData(app, cookies);
  });

  it("should be able to list meals", async () => {
    const cookies = await createUserAndGetCookies(app);

    const mealCreationData = await createMealAndReturnData(app, cookies);

    const mealsListResponse = await request(app.server)
      .get(`/meals/list/${cookies[0].replace("sessionId=", "").split(";")[0]}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(mealsListResponse.body.data).toEqual([
      expect.objectContaining(mealCreationData),
    ]);
  });
});
