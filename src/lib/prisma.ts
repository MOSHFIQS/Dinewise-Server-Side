import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { envVars } from "../config/env";

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient | undefined,
    pool: Pool | undefined 
};

const connectionString = `${envVars.DATABASE_URL}`;

// 🚀 Singleton pattern for Database Pool
export const pool = globalForPrisma.pool || new Pool({ 
    connectionString,
    max: 10, // Stay within Neon's limits
    idleTimeoutMillis: 30000,
});

// 🚀 Singleton pattern for Prisma Client
const adapter = new PrismaPg(pool);
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalForPrisma.pool = pool;
}