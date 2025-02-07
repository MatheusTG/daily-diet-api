import { beforeEach, describe } from "node:test";
import { afterAll, beforeAll, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import { createUserAndGetCookies } from "./utils/createUserAndGetCookies";
import { createMealAndReturnData } from "./utils/createMealAndReturnData";

async function listMealsAndReturnData(cookies: string[]) {
  const mealsListResponse = await request(app.server)
    .get(`/meals/list/${cookies[0].replace("sessionId=", "").split(";")[0]}`)
    .set("Cookie", cookies)
    .expect(200);

  return mealsListResponse.body.data;
}

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

    const mealListData = await listMealsAndReturnData(cookies);

    expect(mealListData).toEqual([expect.objectContaining(mealCreationData)]);
  });

  it("should be able to fetch a meal", async () => {
    const cookies = await createUserAndGetCookies(app);

    const mealCreationData = await createMealAndReturnData(app, cookies);

    const mealListData = await listMealsAndReturnData(cookies);

    const mealFetchResponse = await request(app.server)
      .get(`/meals/${mealListData[0].id}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(mealFetchResponse.body.data).toEqual(
      expect.objectContaining(mealCreationData)
    );
  });

  it("should be able to edit a meal", async () => {
    const cookies = await createUserAndGetCookies(app);

    await createMealAndReturnData(app, cookies);

    const mealListData = await listMealsAndReturnData(cookies);
    const { id } = mealListData[0];

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

  it("should be able to delete a meal", async () => {
    const cookies = await createUserAndGetCookies(app);

    await createMealAndReturnData(app, cookies);

    const mealListData = await listMealsAndReturnData(cookies);

    await request(app.server)
      .delete(`/meals/${mealListData[0].id}`)
      .set("Cookie", cookies)
      .expect(204);
  });
});
