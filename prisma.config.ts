import "dotenv/config";
import { defineConfig } from "prisma/config";
import { envVars } from "./src/config/env";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx src/db/seedCat.ts",
  },
  datasource: {
    url: envVars.DATABASE_URL,
  },
});
