import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import { env } from "./env";
import cookie from "@fastify/cookie";
import { mealsRoutes } from "./routes/meals";

const app = fastify();

app.register(cookie);

app.register(usersRoutes, {
  prefix: "users",
});

app.register(mealsRoutes, {
  prefix: "meals",
});

app
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => console.log("HTTP Server Running!"));
