import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle_output",
  schema: "./src/libs/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
});
