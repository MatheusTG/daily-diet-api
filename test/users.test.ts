import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";

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

  it("should be able to fetch user metrics", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Amanda",
      })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    if (!cookies) throw new Error("Cookies do not exists!");

    await request(app.server).post("/meals").set("Cookie", cookies).send({
      name: "Almoço",
      description: "Arroz, Feijão e Carne",
      datetime: "2024-02-04T15:30:00Z",
      diet: true,
    });
    await request(app.server).post("/meals").set("Cookie", cookies).send({
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
