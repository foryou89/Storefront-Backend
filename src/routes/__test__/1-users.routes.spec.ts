import supertest from 'supertest';
import db from '../../database';
import MyApp from '../../index';
import UserModel from '../../models/users.model';
import User from '../../types/users.type';

const request = supertest(MyApp);
const userModel = new UserModel();

describe('users.routes.spec-> Test create , update and delete of users and test permissions', () => {
  const adminuser = {
    first_name: 'admin',
    last_name: 'user',
    user_email: 'adminuser@email.com',
    user_name: 'ahemd_mohamed_admin',
    password: 'adminuser_password',
  } as User;

  const newuser = {
    first_name: 'test',
    last_name: 'user',
    user_email: 'testuser@email.com',
    user_name: 'ahemd_mohamed_user',
    password: 'newuser_password',
  } as User;

  //- create new admin user in test db
  beforeAll(async () => {
    try {
      const new_user = await userModel.create(adminuser);
      adminuser.id = new_user.id;
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

  //- test api/users endpoint
  it('Check api/users/ endpoint', async () => {
    try {
      const auth = await request
        .post('/api/auth')
        .set('Content-type', 'application/json')
        .send({
          user_email: adminuser.user_email,
          password: adminuser.password,
        });
      adminuser.id = auth.body.data.id;
      adminuser.token = auth.body.data.token;

      //make adminuser as admin
      await userModel.changeUserType(adminuser.id);

      // request to get all users data
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test create new user
  it('Should be create new user with email: testuser@email.com', async () => {
    try {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .send({
          first_name: 'test',
          last_name: 'new user',
          user_email: 'testuser@email.com',
          user_name: 'ahemd_mohamed_user',
          password: 'newuser_password',
        } as User);
      expect(res.status).toBe(200);
      const { first_name, last_name, user_email, user_name } = res.body.data;
      expect(first_name).toBe('test');
      expect(last_name).toBe('new user');
      expect(user_email).toBe('testuser@email.com');
      expect(user_name).toBe('ahemd_mohamed_user');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test update user data
  it('Should be update user data', async () => {
    try {
      //auth to get token
      const auth = await request
        .post('/api/auth')
        .set('Content-type', 'application/json')
        .send({
          user_email: newuser.user_email,
          password: newuser.password,
        });
      newuser.id = auth.body.data.id;
      newuser.token = auth.body.data.token;

      // request to update data
      const res = await request
        .patch('/api/users/' + newuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + newuser.token)
        .send({
          ...newuser,
          first_name: 'updated',
          last_name: 'username',
        });
      expect(res.status).toBe(200);

      const { id, first_name, last_name, user_email, user_name } =
        res.body.data;
      expect(id).toBe(newuser.id);
      expect(user_email).toBe(newuser.user_email);
      expect(user_name).toBe(newuser.user_name);
      expect(first_name).toBe('updated');
      expect(last_name).toBe('username');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get user data
  it('Should be get user data', async () => {
    try {
      // request to get user data
      const res = await request
        .get('/api/users/' + newuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + newuser.token)
        .send();
      expect(res.status).toBe(200);

      const { id, user_email } = res.body.data;
      expect(id).toBe(newuser.id);
      expect(user_email).toBe(newuser.user_email);
      expect(id).toBe(newuser.id);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get all users data by admin
  it('Should be get all users data by admin only', async () => {
    try {
      //make adminuser as admin
      await userModel.changeUserType(adminuser.id);

      // request to get all users data
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      const obj = res.body.data;
      const users = Object.keys(obj).map((k) => obj[k]) as User[];
      expect(res.status).toBe(200);
      expect(users.length).toBe(2);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get all users data by user
  it('Must return permissions error if not admin try to get all users data', async () => {
    try {
      //-request to get all users data
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + newuser.token)
        .send();
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('You dont have permissions');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to block user by admin
  it('Test to block user by admin', async () => {
    try {
      //-request to block user by admin
      const res = await request
        .post('/api/users/block/' + newuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
      expect(res.body.data).toBe(true);
      expect(res.body.status).toBe('success');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to unblock user by admin
  it('Test to unblock user by admin', async () => {
    try {
      //-request to unblock user by admin
      const res = await request
        .post('/api/users/block/' + newuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
      expect(res.body.data).toBe(false);
      expect(res.body.status).toBe('success');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to delete user by user
  it('Test to delete user by user - must return permissions error', async () => {
    try {
      //-request to delete user
      const res = await request
        .delete('/api/users/' + adminuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + newuser.token)
        .send();
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('You dont have permissions');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to delete user by admin
  it('Test to delete user by admin', async () => {
    try {
      //-request to delete user by admin
      const res = await request
        .delete('/api/users/' + newuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to delete all users by admin
  it('Test to delete all users by admin', async () => {
    try {
      //-request to delete all users by admin
      const res = await request
        .delete('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
