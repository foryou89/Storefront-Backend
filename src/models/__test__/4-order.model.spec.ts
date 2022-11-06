import db from '../../database';
import User from '../../types/users.type';
import UserModel from '../users.model';
import ProductModel from '../products.model';
import JsonProducts from '../../const.json.products';
import Product from '../../types/product.type';
import OrderModel from '../order.model';
import Order from '../../types/order.type';
import OrderProduct from '../order_product.model';
import Order_Product from '../../types/order_product.typs';

const userModel = new UserModel();
const productModel = new ProductModel();
const orderModel = new OrderModel();
const orderProduct = new OrderProduct();

const new_user = {
  first_name: 'ahmed',
  last_name: 'mohamed',
  user_email: 'f.test@gmail.com',
  user_name: 'foryou',
  password: 'zasdzasd',
} as User;

let test_order: Order;
let order_prodct_id_for_edit: string;

const json = JSON.parse(JsonProducts) as Product[];

describe('orders.model.spec-> Test all orders model methods', () => {
  beforeAll(async () => {
    try {
      //- create new user in test db
      const us = await userModel.create(new_user);
      new_user.id = us.id;
      //- add test products
      for (let i = 0; i < json.length; i++) {
        const action = await productModel.Create(json[i]);
        json[i].id = action.id;
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  afterAll(async () => {
    try {
      const con = await db.connect();
      const sql1 = 'DELETE FROM users;';
      await con.query(sql1);
      const sql2 = 'DELETE FROM products;';
      await con.query(sql2);
      const sql3 = 'DELETE FROM order_products;';
      await con.query(sql3);
      const sql4 = 'DELETE FROM orders;';
      await con.query(sql4);
      con.release();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check create new order and add products methods', async () => {
    try {
      const all_products = await productModel.GetAllProducts();
      const order = {
        userid: new_user.id,
      } as Order;
      const action = await orderModel.Create(order);
      order.id = action.id;
      test_order = order;
      // add order product
      const op = await orderProduct.Add({
        product_id: all_products[0].id,
        order_id: action.id,
        quantity: 3,
      } as Order_Product);
      order_prodct_id_for_edit = op.id;

      await orderProduct.Add({
        product_id: all_products[1].id,
        order_id: action.id,
        quantity: 4,
      } as Order_Product);

      //- get order to check count products.
      const check = await orderModel.GetOrder(test_order.id);
      expect(action.userid).toBe(new_user.id);
      expect(check.products.length).toBe(2);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check edit order and edit order product methods', async () => {
    try {
      const all_products = await productModel.GetAllProducts();
      //- edit order
      const order = {
        id: test_order.id,
        userid: new_user.id,
      } as Order;
      const action = await orderModel.EditOrder(order);
      test_order = order;
      expect(action.userid).toBe(new_user.id);
      //- edit product order
      await orderProduct.Edit({
        id: order_prodct_id_for_edit,
        product_id: all_products[0].id,
        order_id: action.id,
        quantity: 5,
      } as Order_Product);

      await orderProduct.Add({
        product_id: all_products[2].id,
        order_id: action.id,
        quantity: 5,
      } as Order_Product);
      //- get order to check count products and quantity.
      const check = await orderModel.GetOrder(test_order.id);
      expect(check.products[1].quantity).toBe(5);
      expect(check.products.length).toBe(3);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check delete order product from order', async () => {
    try {
      await orderProduct.Delete(order_prodct_id_for_edit);
      //- get order to check count products.
      const check = await orderModel.GetOrder(test_order.id);
      expect(check.products.length).toBe(2);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get order by id method', async () => {
    try {
      const action = await orderModel.GetOrder(test_order.id);
      expect(action.userid).toBe(new_user.id);
      expect(action.id).toBe(test_order.id);
      expect(action.products.length).toBe(2);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get all orders method', async () => {
    try {
      const action = await orderModel.GetAllOrders();
      expect(action.length).toBe(1);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get all orders by userid method', async () => {
    try {
      const action = await orderModel.GetOrdersByUserid(new_user.id);
      expect(action.length).toBe(1);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get all completed orders by userid method', async () => {
    try {
      const action_before = await orderModel.GetCompletedOrdersByUserid(
        new_user.id
      );
      expect(action_before.length).toBe(0);
      // change order status
      await orderModel.ChangeOrderStatusToComplete(test_order.id);
      const action_after = await orderModel.GetCompletedOrdersByUserid(
        new_user.id
      );
      expect(action_after.length).toBe(1);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get all orders by userid method', async () => {
    try {
      const action_before = await orderModel.DeleteOrder(test_order.id);
      expect(action_before.id).toBe(test_order.id);
      const action_after = await orderModel.GetAllOrders();
      expect(action_after.length).toBe(0);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
