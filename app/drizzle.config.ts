import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./packages/shared/src/db/schema.ts",
    out: "./packages/shared/drizzle",
});
