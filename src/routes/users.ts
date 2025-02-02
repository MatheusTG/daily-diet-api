import { FastifyInstance } from "fastify";
import knex from "knex";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    });

    try {
      const { name } = createUserBodySchema.parse(request.body);

      await knex("transactions").insert({
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
