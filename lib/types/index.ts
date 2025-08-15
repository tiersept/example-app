import { paths } from "./schema";

export type Account =
  paths["/accounts"]["get"]["responses"]["200"]["content"]["application/json"][0];

export type TransactionItem =
  paths["/transactions"]["get"]["responses"]["200"]["content"]["application/json"][0];
