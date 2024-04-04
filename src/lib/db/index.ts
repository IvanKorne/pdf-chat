import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
neonConfig.fetchConnectionCache = true;

if (!process.env.DB_URI) {
  throw new Error("db not found");
}

const sql = neon(process.env.DB_URI);

export const db = drizzle(sql);
