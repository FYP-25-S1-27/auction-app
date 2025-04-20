import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle_output",
  schema: "./src/libs/db/schema.ts",
  casing: "snake_case",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
});