// import { drizzle } from "drizzle-orm/node-postgres";

// export const db = drizzle(process.env.DB_CONNECTION_STRING!);

import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  connection: process.env.DB_CONNECTION_STRING!,
  casing: "snake_case",
});
