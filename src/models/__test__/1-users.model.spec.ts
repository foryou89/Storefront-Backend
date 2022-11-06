import db from '../../database';
import User from '../../types/users.type';
import UserModel from '../users.model';

const userModel = new UserModel();

const new_user = {
  first_name: 'ahmed',
  last_name: 'mohamed',
  user_email: 'f.test@gmail.com',
  user_name: 'foryou',
  password: 'zasdzasd',
} as User;

describe('users.model.spec-> Test all user model methods', () => {
  afterAll(async () => {
    try {
      const con = await db.connect();
      const sql = 'DELETE FROM users;';
      await con.query(sql);
      con.release();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check create new user method', async () => {
    try {
      const action = await userModel.create(new_user);
      new_user.id = action.id;
      expect(action.first_name).toBe(new_user.first_name);
      expect(action.last_name).toBe(new_user.last_name);
      expect(action.user_email).toBe(new_user.user_email);
      expect(action.user_name).toBe(new_user.user_name);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check update user method', async () => {
    try {
      const action = await userModel.updateUser({
        first_name: 'gamal',
        last_name: 'mosa',
        user_email: 'f.test@gmail.com',
        user_name: 'rock',
      } as User);
      expect(action.first_name).toBe('gamal');
      expect(action.last_name).toBe('mosa');
      expect(action.user_email).toBe('f.test@gmail.com');
      expect(action.user_name).toBe('rock');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get user by id method', async () => {
    try {
      const action = await userModel.getUserByID(new_user.id);
      expect(action.first_name).toBe('gamal');
      expect(action.last_name).toBe('mosa');
      expect(action.user_email).toBe('f.test@gmail.com');
      expect(action.user_name).toBe('rock');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get all users method', async () => {
    try {
      const action = await userModel.getAllUsers();
      expect(action.length).toBe(1);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get user type method', async () => {
    try {
      const action = await userModel.getUserType(new_user.id);
      expect(action).toBe(false);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check change user type method', async () => {
    try {
      const action = await userModel.changeUserType(new_user.id);
      expect(action).toBe(true);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check delete user by id method', async () => {
    try {
      const action = await userModel.deleteUser(new_user.id);
      expect(action.id).toBe(new_user.id);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check delete all users method', async () => {
    try {
      //- create new user
      await userModel.create(new_user);
      //- delete all user
      await userModel.deleteAllUser();
      //- get all users
      const all = await userModel.getAllUsers();
      expect(all.length).toBe(0);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
