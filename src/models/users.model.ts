import db from '../database';
import User from '../types/users.type';
import makeHashPassword from '../functions/make_hash_password';

class UserModel {
  //- create new user;
  async create(user: User): Promise<User> {
    try {
      const con = await db.connect();
      const sql_cmd = `INSERT INTO users (first_name, last_name, user_email, user_name, password) 
                      values ($1, $2, $3, $4, $5) 
                      RETURNING id, first_name, last_name, user_email, user_name, created_on, user_block, is_admin`;
      const res = await con.query(sql_cmd, [
        user.first_name,
        user.last_name,
        user.user_email,
        user.user_name,
        makeHashPassword(user.password),
      ]);
      con.release();
      return res.rows[0];
    } catch (error) {
      throw new Error(`Unable to create new user, ${(error as Error).message}`);
    }
  }

  //- delete user by user id;
  async deleteUser(userid: string): Promise<User> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM users WHERE id=($1)';
      const check = await con.query(ch_sql, [userid]);

      if (check.rows.length > 0) {
        const sql =
          'DELETE FROM users WHERE id=($1) RETURNING id, first_name, last_name, user_email, user_name, created_on, user_block, is_admin';
        const res = await con.query(sql, [userid]);
        con.release();
        return res.rows[0];
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(
        `Could not delete user has id ${userid}, ${(error as Error).message}`
      );
    }
  }

  //- delete all users;
  async deleteAllUser(): Promise<void> {
    try {
      const con = await db.connect();
      const sql = 'DELETE FROM users';
      await con.query(sql);
      con.release();
    } catch (error) {
      throw new Error(`Could not delete users, ${(error as Error).message}`);
    }
  }

  //- get all users;
  async getAllUsers(): Promise<User[]> {
    try {
      const con = await db.connect();
      const sql =
        'SELECT id, first_name, last_name, user_email, user_name, created_on, user_block , is_admin FROM users';
      const res = await con.query(sql);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(
        `There was an error in getting the users, ${(error as Error).message}`
      );
    }
  }

  //- get user by id;
  async getUserByID(userid: string): Promise<User> {
    try {
      const con = await db.connect();
      const sql =
        'SELECT id, first_name, last_name, user_email, user_name, created_on, user_block, is_admin FROM users WHERE id=($1)';
      const res = await con.query(sql, [userid]);
      con.release();
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(
        `Could not find user has id ${userid}, ${(error as Error).message}`
      );
    }
  }

  //- update user data
  async updateUser(user: User): Promise<User> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM users WHERE user_email=($1)';
      const check = await con.query(ch_sql, [user.user_email]);

      if (check.rows.length > 0) {
        const sql = `UPDATE users 
                          SET first_name=$1, last_name=$2, user_email=$3, user_name=$4, password=$5
                          WHERE id=$6 
                          RETURNING id, first_name, last_name, user_email, user_name, created_on, user_block, is_admin`;

        const res = await con.query(sql, [
          user.first_name,
          user.last_name,
          user.user_email,
          user.user_name,
          makeHashPassword(user.password),
          check.rows[0]['id'],
        ]);
        con.release();
        return res.rows[0];
      } else {
        con.release();
        throw new Error(`User: ${user.user_name} Not found.`);
      }
    } catch (error) {
      throw new Error(
        `Could not update user: ${user.user_name}, ${(error as Error).message}`
      );
    }
  }

  //- check if user is blocked;
  async checkUserBlock(userid: string): Promise<boolean> {
    try {
      const con = await db.connect();
      const sql = 'SELECT user_block FROM users WHERE id=($1)';
      const res = await con.query(sql, [userid]);
      con.release();
      return res.rows[0]['user_block'];
    } catch (error) {
      throw new Error(
        `Could not find user has id ${userid}, ${(error as Error).message}`
      );
    }
  }

  //- change user blocked;
  async changeUserBlock(userid: string): Promise<boolean> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id , user_block FROM users WHERE id=($1)';
      const check = await con.query(ch_sql, [userid]);

      if (check.rows.length > 0) {
        const sql = 'UPDATE users SET user_block=$1 WHERE id=$2';
        await con.query(sql, [!check.rows[0]['user_block'], userid]);
        con.release();
        return !check.rows[0]['user_block'];
      } else {
        con.release();
        throw new Error('This user id Not found.');
      }
    } catch (error) {
      throw new Error(
        `Could not find user has id ${userid}, ${(error as Error).message}`
      );
    }
  }

  //- get user type is_admin -> admin = true , user = false
  async getUserType(userid: string): Promise<boolean> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id,is_admin FROM users WHERE id=($1)';
      const check = await con.query(ch_sql, [userid]);
      if (check.rows.length > 0) {
        con.release();
        return check.rows[0]['is_admin'];
      } else {
        con.release();
        throw new Error('This user id Not found.');
      }
    } catch (error) {
      throw new Error(
        `Could not find user has id ${userid}, ${(error as Error).message}`
      );
    }
  }

  //- get user data by auth token
  async getUserByToken(token: string): Promise<User> {
    try {
      const con = await db.connect();
      const ch_sql =
        'SELECT id, first_name, last_name, user_email, user_name, created_on, user_block, is_admin, token FROM users WHERE token=($1)';
      const check = await con.query(ch_sql, [token]);
      if (check.rows.length > 0) {
        con.release();
        return check.rows[0];
      } else {
        con.release();
        throw new Error('This user id Not found.');
      }
    } catch (error) {
      throw new Error(`Could not find user, ${(error as Error).message}`);
    }
  }

  //- change user type admin <-> user;
  async changeUserType(userid: string): Promise<boolean> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM users WHERE id=($1)';
      const check = await con.query(ch_sql, [userid]);

      if (check.rows.length > 0) {
        const sql =
          'UPDATE users SET is_admin=$1 WHERE id=$2 RETURNING id, first_name, last_name, user_email, user_name, created_on, user_block, is_admin';
        await con.query(sql, [!check.rows[0]['is_admin'], userid]);
        con.release();
        return !check.rows[0]['is_admin'];
      } else {
        con.release();
        throw new Error('This user id Not found.');
      }
    } catch (error) {
      throw new Error(
        `Could not find user has id ${userid}, ${(error as Error).message}`
      );
    }
  }
}

export default UserModel;
