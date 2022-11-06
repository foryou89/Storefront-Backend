import dotenv from 'dotenv';

dotenv.config();

const {
  SERVER_PORT,
  DB_USES,
  DB_HOST,
  DB_REAL_NAME,
  DB_TEST_NAME,
  DB_USER,
  DB_PASS,
  DB_PORT,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  TOKEN_SECRET,
} = process.env;

export default {
  server_port: SERVER_PORT,
  db_host: DB_HOST,
  db_name: DB_USES == 'developer' ? DB_REAL_NAME : DB_TEST_NAME,
  db_user: DB_USER,
  db_pass: DB_PASS,
  db_port: DB_PORT,
  bc_pass: BCRYPT_PASSWORD,
  bc_sr: SALT_ROUNDS,
  token_secret: TOKEN_SECRET,
};
