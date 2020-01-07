import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'farrux19941214',
  database: 'userpostsdb',
  port: 5432
});
