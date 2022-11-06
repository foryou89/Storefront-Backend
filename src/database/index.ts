import { Pool as DB } from 'pg';
import config from '../config';

const db = new DB({
  user: config.db_user,
  host: config.db_host,
  database: config.db_name,
  password: config.db_pass,
  port: parseInt(config.db_port as string),
  max: 100,
});

db.on('error', (error: Error) => {
  console.error(error);
  process.exit(1);
});

export default db;
