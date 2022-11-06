import db from '../database';
import passwordCompare from '../functions/password_compare';
import User from '../types/users.type';

class UserAuth {
  // authenticate and get token
  async auth(useremail: string, password: string): Promise<User | null> {
    try {
      const con = await db.connect();
      const sql = 'SELECT password FROM users WHERE user_email=$1';
      const result = await con.query(sql, [useremail]);
      if (result.rows.length > 0) {
        const { password: hash_password } = result.rows[0];
        if (passwordCompare(password, hash_password)) {
          const user_data = await con.query(
            'SELECT id, first_name, last_name, user_email, user_name, created_on, user_block, is_admin FROM users WHERE user_email=($1)',
            [useremail]
          );
          return user_data.rows[0];
        }
      }
      con.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`);
    }
  }

  //- save token to user
  async saveToken(useremail: string, token: string): Promise<void> {
    try {
      const con = await db.connect();
      const sql = 'UPDATE users SET token=$1 WHERE user_email=$2';
      await con.query(sql, [token, useremail]);
      con.release();
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`);
    }
  }
}

export default UserAuth;
