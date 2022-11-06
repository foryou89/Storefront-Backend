import supertest from 'supertest';
import db from '../../database';
import MyApp from '../../index';
import ProductModel from '../../models/products.model';
import Product from '../../types/product.type';
import UserModel from '../../models/users.model';
import User from '../../types/users.type';
import JsonProducts from '../../const.json.products';
import Order from '../../types/order.type';
import OrderModel from '../../models/order.model';
import OrderProduct from '../../models/order_product.model';

const request = supertest(MyApp);
const productModel = new ProductModel();
const userModel = new UserModel();
const orderModel = new OrderModel();
const orderProduct = new OrderProduct();

describe('orders.routes.spec-> Test create , update and delete of orders', () => {
  const adminuser = {
    first_name: 'test',
    last_name: 'user',
    user_email: 'testuser@email.com',
    user_name: 'ahemd_mohamed_user',
    password: 'newuser_password',
  } as User;

  let my_order: Order;

  //- create new user in test db
  beforeAll(async () => {
    try {
      const new_user = await userModel.create(adminuser);
      adminuser.id = new_user.id;
      const json = JSON.parse(JsonProducts) as Product[];
      for (let i = 0; i < json.length; i++) {
        await productModel.Create(json[i]);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- delete all users, products and orders from db
  afterAll(async () => {
    try {
      const con = await db.connect();
      const sql1 = 'DELETE FROM users;';
      await con.query(sql1);
      const sql2 = 'DELETE FROM products;';
      await con.query(sql2);
      const sql3 = 'DELETE FROM orders;';
      await con.query(sql3);
      con.release();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test api/orders endpoint
  it('Check api/orders/ endpoint', async () => {
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

      // request to get all orders
      const res = await request
        .get('/api/orders/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test create new order
  it('Should be create new order with one product', async () => {
    try {
      //- get all products
      const products = await productModel.GetAllProducts();
      //- make order
      const order = {
        userid: adminuser.id,
      } as Order;

      const res = await request
        .post('/api/orders/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send(order);
      const { userid, id } = res.body.data;
      order.id = id;
      my_order = order;

      expect(res.status).toBe(200);
      expect(userid).toBe(adminuser.id);

      //- add first product to order
      const res2 = await request
        .post('/api/orders/product/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send({
          product_id: products[0].id,
          order_id: order.id,
          quantity: 1,
        });
      expect(res2.status).toBe(200);
      expect(res2.body.data.product_id).toBe(products[0].id);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test update order product
  it('Should be update order product', async () => {
    try {
      const allproducts = await productModel.GetAllProducts();
      const order = await orderModel.GetOrder(my_order.id);
      const op = await orderProduct.GetOne(order.products[0].id);
      // request to update order product
      const res = await request
        .patch('/api/orders/product/' + op.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send({
          product_id: allproducts[0].id,
          order_id: order.id,
          quantity: 3,
        });
      const { quantity, product_id, order_id } = res.body.data;
      expect(res.status).toBe(200);
      expect(order_id).toBe(my_order.id);
      expect(product_id).toBe(allproducts[0].id);
      expect(quantity).toBe(3);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get order data
  it('Should be get order data', async () => {
    try {
      // request to get order data
      const res = await request
        .get('/api/orders/' + my_order.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
      const { id, products } = res.body.data;
      expect(id).toBe(my_order.id);
      expect(products.length).toBe(1);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to get all orders data
  it('Should be get all orders', async () => {
    try {
      // request to get all orders data
      const res = await request
        .get('/api/orders/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      const obj = res.body.data;
      const orders = Object.keys(obj).map((k) => obj[k]) as Product[];
      expect(res.status).toBe(200);
      expect(orders.length).toBe(1);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to delete order product by id
  it('Test to delete order product by id', async () => {
    try {
      const order = await orderModel.GetOrder(my_order.id);
      const op = await orderProduct.GetOne(order.products[0].id);
      //-request to delete order product by id
      const res = await request
        .delete('/api/orders/product/' + op.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- test to delete order by id
  it('Test to delete order by id', async () => {
    try {
      //-request to delete order by id
      const res = await request
        .delete('/api/orders/' + my_order.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      expect(res.status).toBe(200);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- Test to get orders by userid
  it('Test to get orders by userid', async () => {
    try {
      //- get all products
      const allproducts = await productModel.GetAllProducts();
      //- add test 10 orders with 8 completed
      for (let i = 0; i < 10; i++) {
        const order = {
          userid: adminuser.id,
          status: i <= 7 ? true : false,
        } as Order;
        const new_order = await orderModel.Create(order);
        //- add one product to this order
        await request
          .post('/api/orders/product')
          .set('Content-type', 'application/json')
          .set('Authorization', 'Bearer ' + adminuser.token)
          .send({
            product_id: allproducts[i].id,
            order_id: new_order.id,
            quantity: 1,
          });
      }
      //-request to get orders by userid
      const res = await request
        .get('/api/orders/user/' + adminuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      const orders = res.body.data;

      expect(res.status).toBe(200);
      expect(orders.length).toBe(10);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  //- Test to get completed orders by userid
  it('Test to get completed orders by userid', async () => {
    try {
      //-request to get completed orders by userid
      const res = await request
        .get('/api/orders/completed/' + adminuser.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + adminuser.token)
        .send();
      const orders = res.body.data;

      expect(res.status).toBe(200);
      expect(orders.length).toBe(8);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
