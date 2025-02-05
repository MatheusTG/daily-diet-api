import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z, ZodError } from "zod";
import { randomUUID } from "node:crypto";

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/:sessionId", async (request, reply) => {
    const getMealsParamsSchema = z.object({
      sessionId: z.string().uuid(),
    });

    const { sessionId } = getMealsParamsSchema.parse(request.params);

    try {
      const meals = await knex("meals").where("session_id", sessionId).select();

      return reply.status(200).send({
        success: true,
        message: "The news listing was a success.",
        data: meals,
      });
    } catch (error) {
      console.log(error);

      return reply.status(500).send({
        success: false,
        message: "Unexpected error. Please try again later.",
        data: null,
      });
    }
  });

  app.post("/", async (request, reply) => {
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      datetime: z.string().regex(datetimeRegex),
      diet: z.boolean(),
    });

    try {
      const mealBody = createMealBodySchema.parse(request.body);

      const { sessionId } = request.cookies;

      if (!sessionId) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized access",
          data: null,
        });
      }

      await knex("meals").insert({
        id: randomUUID(),
        ...mealBody,
        session_id: sessionId,
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

  app.put("/:id", async (request, reply) => {
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      datetime: z.string().regex(datetimeRegex),
      diet: z.boolean(),
    });

    try {
      const mealBody = createMealBodySchema.parse(request.body);

      const editMealsParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = editMealsParamsSchema.parse(request.params);

      await knex("meals").where("id", id).update(mealBody);

      return reply.status(200).send({
        success: true,
        message: "News edited successfully",
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
