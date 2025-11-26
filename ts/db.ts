import dotenv from "dotenv";
dotenv.config(); // ← CARREGA o .env ANTES de process.env

import { Client } from "pg";

export const db = new Client({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

db.connect();


