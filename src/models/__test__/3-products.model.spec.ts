import db from '../../database';
import User from '../../types/users.type';
import UserModel from '../users.model';
import ProductModel from '../products.model';
import JsonProducts from '../../const.json.products';
import Product from '../../types/product.type';

const userModel = new UserModel();
const productModel = new ProductModel();

const new_user = {
  first_name: 'ahmed',
  last_name: 'mohamed',
  user_email: 'f.test@gmail.com',
  user_name: 'foryou',
  password: 'zasdzasd',
} as User;

const test_product = {
  name: 'iPhone 9',
  category: 'smartphones',
  photo: 'https://via.placeholder.com/300',
  price: 549,
  quantity: 100,
} as Product;

const json = JSON.parse(JsonProducts) as Product[];

describe('products.model.spec-> Test all products model methods', () => {
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
      const sql1 = 'DELETE FROM users;';
      await con.query(sql1);
      const sql2 = 'DELETE FROM products;';
      await con.query(sql2);
      con.release();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check create new product method', async () => {
    try {
      const action = await productModel.Create(test_product);
      test_product.id = action.id;
      expect(action.name).toBe(test_product.name);
      expect(action.category).toBe(test_product.category);
      expect(action.quantity).toBe(test_product.quantity);
      expect(action.price.toString()).toBe(`${test_product.price}.00`);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check edit product method', async () => {
    try {
      const action = await productModel.EditProduct({
        id: test_product.id,
        name: 'iPhone 9',
        category: 'smartphones',
        photo: 'https://via.placeholder.com/300',
        price: 9685,
        quantity: 150,
      } as Product);
      expect(action.id).toBe(test_product.id);
      expect(action.price.toString()).toBe('9685.00');
      test_product.price = 9685;
      expect(action.quantity).toBe(150);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get product by id method', async () => {
    try {
      const action = await productModel.GetProduct(test_product.id);
      expect(action.id).toBe(test_product.id);
      expect(action.name).toBe(test_product.name);
      expect(action.price.toString()).toBe(`${test_product.price}.00`);
      expect(action.category).toBe(test_product.category);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check delete product by id method', async () => {
    try {
      const action = await productModel.DeleteProduct(test_product.id);
      expect(action.id).toBe(test_product.id);
      expect(action.name).toBe(test_product.name);
      expect(action.price.toString()).toBe(`${test_product.price}.00`);
      expect(action.category).toBe(test_product.category);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get all products method', async () => {
    try {
      //- add test products
      for (let i = 0; i < json.length; i++) {
        const action = await productModel.Create(json[i]);
        json[i].id = action.id;
      }
      const action = await productModel.GetAllProducts();
      expect(action.length).toBe(json.length);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get all products by category name method', async () => {
    try {
      const action = await productModel.GetProductsByCategory(
        test_product.category
      );
      expect(action.length).toBe(5);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check get most popular products method, as default 5 products', async () => {
    try {
      const action = await productModel.GetMostPopularProducts();
      expect(action.length).toBe(5);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check number of quantity in stock method', async () => {
    try {
      const action = await productModel.NumberInStock(json[0].id);
      expect(action).toBe(100);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check adjust product quantity method', async () => {
    try {
      await productModel.AdjustProductQuantity(json[0].id, -10);
      const action = await productModel.GetProduct(json[0].id);
      expect(action.quantity).toBe(90);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

  it('Check update number of sales method', async () => {
    try {
      await productModel.UpdateNumberOfSales(json[0].id, 2);
      const action = await productModel.GetProduct(json[0].id);
      expect(action.number_of_sales).toBe(2);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
});
