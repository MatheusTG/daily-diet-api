import { knex as sutupKnex, Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
};

export const knex = sutupKnex(config);
