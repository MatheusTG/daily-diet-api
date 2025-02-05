import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { sessionId } = request.cookies;

  if (!sessionId) {
    return reply.status(401).send({
      success: false,
      message: "Unauthorized access",
      data: null,
    });
  }
}
