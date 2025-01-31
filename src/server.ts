import fastify from "fastify";
import { usersRoutes } from "./routes/users";

const app = fastify();

app.register(usersRoutes, {
  prefix: "users",
});

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => console.log("HTTP Server Running!"));
