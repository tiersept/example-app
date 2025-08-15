import createClient from "openapi-react-query";
import { client } from "./client";

export const $api = createClient(client);
