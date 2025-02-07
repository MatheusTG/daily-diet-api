export interface MealsType {
  id: string;
  name: string;
  description: string;
  datetime: string;
  diet: boolean;
  session_id: string;
  created_at: string;
  updated_at: string;
}

export type MealsCreateType = Pick<
  MealsType,
  "name" | "description" | "datetime" | "diet"
>;
