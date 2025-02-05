import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/checkSessionIdExists";
import { handleError } from "../utils/handleError";

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/list/:sessionId", async (request, reply) => {
    const getMealsParamsSchema = z.object({
      sessionId: z.string().uuid(),
    });

    const { sessionId } = getMealsParamsSchema.parse(request.params);

    try {
      const meals = await knex("meals").where("session_id", sessionId).select();

      return reply.status(200).send({
        success: true,
        message: "The news listing was a success!",
        data: meals,
      });
    } catch (error) {
      handleError(error, reply);
    }
  });

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      });

      try {
        const { id } = getMealsParamsSchema.parse(request.params);

        const meal = await knex("meals").where("id", id).select().first();

        return reply.status(200).send({
          success: true,
          message: "The news fetch was a success!",
          data: meal,
        });
      } catch (error) {
        handleError(error, reply);
      }
    }
  );

  app.post(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
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

        await knex("meals").insert({
          id: randomUUID(),
          ...mealBody,
          session_id: sessionId,
        });
      } catch (error) {
        handleError(error, reply);
      }
    }
  );

  app.put(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
      const editMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        datetime: z.string().regex(datetimeRegex),
        diet: z.boolean(),
      });

      try {
        const mealBody = editMealBodySchema.parse(request.body);

        const editMealsParamsSchema = z.object({
          id: z.string().uuid(),
        });

        const { id } = editMealsParamsSchema.parse(request.params);

        await knex("meals")
          .where("id", id)
          .update({ ...mealBody, updated_at: new Date().toISOString() });

        return reply.status(200).send({
          success: true,
          message: "News edited successfully!",
          data: null,
        });
      } catch (error) {
        handleError(error, reply);
      }
    }
  );

  app.delete(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const deleteIdMealScheme = z.object({
        id: z.string().uuid(),
      });

      try {
        const { id } = deleteIdMealScheme.parse(request.params);

        await knex("meals").where("id", id).del();
      } catch (error) {
        handleError(error, reply);
      }
    }
  );
}
