import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function setupExtensions() {
  await sql`CREATE EXTENSION IF NOT EXISTS postgis;`;
  console.log("PostGIS extension created");
  await sql.end();
}

setupExtensions();
