import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { handleError } from "../utils/handleError";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    });

    try {
      const { name } = createUserBodySchema.parse(request.body);

      let sessionId = request.cookies.sessionId;
      if (!sessionId) {
        sessionId = randomUUID();

        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      await knex("users").insert({
        id: randomUUID(),
        name,
        session_id: sessionId,
      });

      return reply.status(201).send({
        success: true,
        message: "User created successfully!",
        data: null,
      });
    } catch (error) {
      handleError(error, reply);
    }
  });
}
