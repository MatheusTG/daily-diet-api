import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createUserAndGetCookies(app: FastifyInstance) {
  const userCreateResponse = await request(app.server)
    .post("/users")
    .send({
      name: "Amanda",
    })
    .expect(201);

  const cookies = userCreateResponse.get("Set-Cookie");

  if (!cookies) throw new Error("Cookies do not exists!");

  return cookies;
}
