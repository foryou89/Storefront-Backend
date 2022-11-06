import db from '../../database';
import User from '../../types/users.type';
import UserAuth from '../auth.model';
import UserModel from '../users.model';

const userModel = new UserModel();
const userAuth = new UserAuth();

const new_user = {
  first_name: 'ahmed',
  last_name: 'mohamed',
  user_email: 'f.test@gmail.com',
  user_name: 'foryou',
  password: 'zasdzasd',
} as User;

//- authentication and get token
describe('auth.model.spec-> Test all auth model methods', () => {
  //- create new user in test db
  beforeAll(async () => {
    try {
      const us = await userModel.create(new_user);
      new_user.id = us.id;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

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

  it('Check authentication method', async () => {
    try {
      const action = await userAuth.auth(
        new_user.user_email,
        new_user.password
      );
      new_user.token = action?.token ?? '';
      expect(action?.id).toBe(new_user.id);
      expect(action?.user_email).toBe(new_user.user_email);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check save token method', async () => {
    try {
      await userAuth.saveToken(new_user.user_email, new_user.token);
      const action = await userModel.getUserByToken(new_user.token);
      expect(action.id).toBe(new_user.id);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
