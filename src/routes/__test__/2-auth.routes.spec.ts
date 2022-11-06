import supertest from 'supertest';
import db from '../../database';
import MyApp from '../../index';
import UserModel from '../../models/users.model';
import User from '../../types/users.type';

//- create a request object
const request = supertest(MyApp);
const userModel = new UserModel();

//- authentication and get token
describe('auth.routes.spec-> Verify authentication and get tokens', () => {
  const user = {
    first_name: 'test',
    last_name: 'user',
    user_email: 'testuser@email.com',
    user_name: 'ahemd_mohamed_user',
    password: 'zasdzasd',
    is_admin: false,
  } as User;

  //- create new user in test db
  beforeAll(async () => {
    try {
      const new_user = await userModel.create(user);
      user.id = new_user.id;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- delete all users from db
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

  //- test api/auth endpoint
  it('Check api/auth/ endpoint', async () => {
    try {
      const response = await request.post('/api/auth/');
      //- Should return 401 not 404
      expect(response.status).toBe(401);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test authenticate with valid data
  it('Test authenticate with valid data -> Should be able to login and get a token', async () => {
    try {
      const res = await request
        .post('/api/auth')
        .set('Content-type', 'application/json')
        .send({
          user_email: 'testuser@email.com',
          password: 'zasdzasd',
        });
      expect(res.status).toBe(200);
      const { id, user_email } = res.body.data;
      expect(id).toBe(user.id);
      expect(user_email).toBe('testuser@email.com');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test try authenticate with wrong data
  it('Test authenticate with wrong data -> Should be return login error', async () => {
    try {
      const res = await request
        .post('/api/auth')
        .set('Content-type', 'application/json')
        .send({
          user_email: 'wrong@email.com',
          password: 'wrong_password',
        });
      expect(res.status).toBe(401);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
