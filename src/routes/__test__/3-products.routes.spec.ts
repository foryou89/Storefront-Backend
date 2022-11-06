import supertest from 'supertest';
import db from '../../database';
import MyApp from '../../index';
import ProductModel from '../../models/products.model';
import Product from '../../types/product.type';
import UserModel from '../../models/users.model';
import User from '../../types/users.type';
import JsonProducts from '../../const.json.products';

const request = supertest(MyApp);
const productModel = new ProductModel();
const userModel = new UserModel();

describe('products.routes.spec-> Test create , update and delete of products', () => {
  const newproduct = {
    name: 'new_product_',
    photo: 'https://via.placeholder.com/300',
    price: 5956,
    category: 'test_category',
    quantity: 25,
  } as Product;

  const adminuser = {
    first_name: 'test',
    last_name: 'user',
    user_email: 'testuser@email.com',
    user_name: 'ahemd_mohamed_user',
    password: 'newuser_password',
  } as User;

  //- create new user in test db
  beforeAll(async () => {
    try {
      const new_user = await userModel.create(adminuser);
      adminuser.id = new_user.id;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- delete all users and products from db
  afterAll(async () => {
    try {
      const con = await db.connect();
      const sql1 = 'DELETE FROM users;';
      await con.query(sql1);
      const sql2 = 'DELETE FROM products;';
      await con.query(sql2);
      con.release();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test api/products endpoint
  it('Check api/products/ endpoint', async () => {
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

      // request to get all products
      const res = await request
        .get('/api/products/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test create new product
  it('Should be create new product with name : new_product_', async () => {
    try {
      const res = await request
        .post('/api/products/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send({
          name: 'new_product_0',
          photo: 'https://via.placeholder.com/300',
          price: 5956,
          category: 'test_category',
          quantity: 25,
        } as Product);
      expect(res.status).toBe(200);
      const { id, name, category } = res.body.data;
      newproduct.id = id;
      expect(name).toBe('new_product_0');
      expect(category).toBe('test_category');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test update product data
  it('Should be update product data', async () => {
    try {
      // request to update data
      const res = await request
        .patch('/api/products/' + newproduct.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send({
          ...newproduct,
          price: 9999,
          quantity: '50',
        });
      expect(res.status).toBe(200);

      const { id, name, price, quantity } = res.body.data;
      expect(id).toBe(newproduct.id);
      expect(name).toBe(newproduct.name);
      expect(price as string).toBe('9999.00');
      expect(quantity).toBe(50);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get products data
  it('Should be get products data', async () => {
    try {
      // request to get products data
      const res = await request
        .get('/api/products/' + newproduct.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
      const { id, name } = res.body.data;
      expect(id).toBe(newproduct.id);
      expect(name).toBe(newproduct.name);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get all products data
  it('Should be get all products data', async () => {
    try {
      // request to get all products data
      const res = await request
        .get('/api/products/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      const obj = res.body.data;
      const products = Object.keys(obj).map((k) => obj[k]) as Product[];
      expect(res.status).toBe(200);
      expect(products.length).toBe(1);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to delete product by id
  it('Test to delete product by id', async () => {
    try {
      //-request to delete product by id
      const res = await request
        .delete('/api/products/' + newproduct.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get most popular products limit 5 products
  it('test to get most popular products limit 5 products', async () => {
    try {
      //- add test products
      const json = JSON.parse(JsonProducts) as Product[];
      for (let i = 0; i < json.length; i++) {
        await productModel.Create(json[i]);
      }
      //-request to get most popular products
      const res = await request
        .get('/api/products/best/5')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      const obj = res.body.data;
      const products = Object.keys(obj).map((k) => obj[k]) as Product[];
      expect(res.status).toBe(200);
      expect(products.length).toBe(5);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get products by category
  it('test to get products by category name', async () => {
    try {
      //-request to get products by category name
      const res = await request
        .get('/api/products/category/smartphones')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      const obj = res.body.data;
      const products = Object.keys(obj).map((k) => obj[k]) as Product[];
      expect(res.status).toBe(200);
      expect(products.length).toBe(5);
      expect(products[0].category).toBe('smartphones');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
