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

  it("should be able to fetch a meal", async () => {
    const cookies = await createUserAndGetCookies(app);

    const mealCreationData = await createMealAndReturnData(app, cookies);

    const mealsListResponse = await request(app.server)
      .get(`/meals/list/${cookies[0].replace("sessionId=", "").split(";")[0]}`)
      .set("Cookie", cookies)
      .expect(200);

    const { id } = mealsListResponse.body.data[0];

    const mealFetchResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(mealFetchResponse.body.data).toEqual(
      expect.objectContaining(mealCreationData)
    );
  });

  it("should be able to edit a meal", async () => {
    const cookies = await createUserAndGetCookies(app);

    await createMealAndReturnData(app, cookies);

    const mealsListResponse = await request(app.server)
      .get(`/meals/list/${cookies[0].replace("sessionId=", "").split(";")[0]}`)
      .set("Cookie", cookies)
      .expect(200);

    const { id } = mealsListResponse.body.data[0];

    const mealEditData = {
      name: "Almoço",
      description: "Arroz, Feijão e Carne",
      datetime: "2023-04-05T15:30:00Z",
      diet: true,
    };

    await request(app.server)
      .put(`/meals/${id}`)
      .set("Cookie", cookies)
      .send(mealEditData)
      .expect(200);

    const mealFetchResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(mealFetchResponse.body.data).toEqual(
      expect.objectContaining({ ...mealEditData, diet: mealEditData ? 1 : 0 })
    );
  });
});
