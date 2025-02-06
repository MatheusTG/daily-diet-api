import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { handleError } from "../utils/handleError";
import { checkSessionIdExists } from "../middlewares/checkSessionIdExists";

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      try {
        const { sessionId } = request.cookies;

        const user = await knex("users")
          .where("session_id", sessionId)
          .select()
          .first();

        return reply.status(200).send({
          seccess: true,
          message: "The user fetch was a success!",
          data: user,
        });
      } catch (error) {
        handleError(error, reply);
      }
    }
  );

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

  app.get(
    "/metrics/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getUserMetricsParamsSchema = z.object({
        id: z.string().uuid(),
      });

      try {
        const { id } = getUserMetricsParamsSchema.parse(request.params);

        const user = await knex("users").where("id", id).select().first();

        const userMeals = await knex("meals")
          .where("session_id", user?.session_id)
          .select();

        const numberOfMeals = userMeals.length;
        const mealsInTheDiet = userMeals.filter((meal) => meal.diet).length;
        const offDietMeals = numberOfMeals - mealsInTheDiet;
        const bestSequence = userMeals
          .sort((a, b) => {
            return (
              new Date(a.datetime).getTime() - new Date(a.datetime).getTime()
            );
          })
          .reduce(
            (acc, meal) => {
              const { result, currentSequence: cur } = acc;

              if (meal.diet) return { result, currentSequence: cur + 1 };

              if (cur > result) return { result: cur, currentSequence: 0 };
              else return { result, currentSequence: 0 };
            },
            { result: 0, currentSequence: 0 }
          ).result;

        const metrics = {
          numberOfMeals,
          mealsInTheDiet,
          offDietMeals,
          bestSequence,
        };

        return reply.status(200).send({
          success: true,
          message: "The metrics fetch was a success!",
          data: metrics,
        });
      } catch (error) {
        handleError(error, reply);
      }
    }
  );
}
