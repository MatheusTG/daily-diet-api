import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import { env } from "./env";

const app = fastify();

app.register(usersRoutes, {
  prefix: "users",
});

app
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => console.log("HTTP Server Running!"));
