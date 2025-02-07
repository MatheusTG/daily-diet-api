import { FastifyInstance } from "fastify";
import { MealsCreateType } from "../../src/@types/MealsType";
import request from "supertest";

export async function createMealAndReturnData(
  app: FastifyInstance,
  cookies: string[],
  data?: MealsCreateType
) {
  const meal = {
    name: "Janta",
    description: "Arroz, Feijão e Frango",
    datetime: "2024-02-05T15:30:00Z",
    diet: false,
  };

  await request(app.server)
    .post("/meals")
    .set("Cookie", cookies)
    .send(data || meal)
    .expect(201);

  return (data && { ...data, diet: data.diet ? 0 : 1 }) || { ...meal, diet: 0 };
}
