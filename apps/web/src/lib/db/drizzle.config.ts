import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle_output",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
});
