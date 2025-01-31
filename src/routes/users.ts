import { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/", (response, reply) => {
    return reply.send("Retorno dos usuários");
  });
}
