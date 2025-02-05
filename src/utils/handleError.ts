import { FastifyReply } from "fastify";
import { ZodError } from "zod";

export function handleError(error: unknown, reply: FastifyReply) {
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
