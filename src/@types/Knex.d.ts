// eslint-disable-next-line
import { Knex } from "knex";
import { MealsType } from "./MealsType";
import { UsersType } from "./UsersType";

declare module "knex/types/tables" {
  export interface Tables {
    users: UsersType;
    meals: MealsType;
  }
}
