import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    });

    try {
      const { name } = createUserBodySchema.parse(request.body);

      if (!request.cookies.sessionId) {
        const sessionId = randomUUID();

        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      await knex("users").insert({
        id: randomUUID(),
        name,
      });

      return reply.status(201).send();
    } catch (error) {
      console.error(error);

      return reply.status(400).send();
    }
  });
}
