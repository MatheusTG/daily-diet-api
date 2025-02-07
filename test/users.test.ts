import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import { createUserAndGetCookies } from "./utils/createUserAndGetCookies";
import { createMealAndReturnData } from "./utils/createMealAndReturnData";

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
    await createUserAndGetCookies(app);
  });

  it("should be able to fetch a user", async () => {
    const cookies = await createUserAndGetCookies(app);

    await request(app.server).get("/users").set("Cookie", cookies).expect(200);
  });

  it("should be able to fetch user metrics", async () => {
    const cookies = await createUserAndGetCookies(app);

    await createMealAndReturnData(app, cookies, {
      name: "Almoço",
      description: "Arroz, Feijão e Carne",
      datetime: "2024-02-04T15:30:00Z",
      diet: true,
    });
    await createMealAndReturnData(app, cookies, {
      name: "Janta",
      description: "Arroz, Feijão e Frango",
      datetime: "2024-02-05T15:30:00Z",
      diet: false,
    });

    const userResponse = await request(app.server)
      .get("/users")
      .set("Cookie", cookies);

    const userMetricsResponse = await request(app.server)
      .get(`/users/metrics/${userResponse.body.data.id}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(userMetricsResponse.body.data).toEqual({
      numberOfMeals: 2,
      mealsInTheDiet: 1,
      offDietMeals: 1,
      bestSequence: 1,
    });
  });
});
