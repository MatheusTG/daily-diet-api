import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z, ZodError } from "zod";

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
      console.error(error);

      if (error instanceof ZodError) {
        return reply.status(400).send({
          success: false,
          message: "Validation Error",
          data: null,
        });
      }

      return reply.status(500).send({
        success: false,
        message: "Unexpected error. Please try again later.",
        data: null,
      });
    }
  });
}
