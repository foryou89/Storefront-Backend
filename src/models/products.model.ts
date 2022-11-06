import db from '../database';
import Product from '../types/product.type';

class ProductModel {
  //- method to create new product
  async Create(product: Product): Promise<Product> {
    try {
      const con = await db.connect();
      const sql_cmd = `INSERT INTO products (name , category , photo , price , quantity ) 
                            values ($1, $2, $3, $4, $5) 
                            RETURNING *`;
      const res = await con.query(sql_cmd, [
        product.name,
        product.category,
        product.photo,
        product.price,
        product.quantity,
      ]);
      con.release();
      return res.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create new product, ${(error as Error).message}`
      );
    }
  }

  //- method to get one product
  async GetProduct(id: string): Promise<Product> {
    try {
      const con = await db.connect();
      const sql_cmd = 'SELECT * FROM products WHERE id=($1)';
      const res = await con.query(sql_cmd, [id]);
      con.release();
      return res.rows[0];
    } catch (error) {
      throw new Error(`Unable to get product, ${(error as Error).message}`);
    }
  }

  //- method to get all products
  async GetAllProducts(): Promise<Product[]> {
    try {
      const con = await db.connect();
      const sql_cmd = 'SELECT * FROM products';
      const res = await con.query(sql_cmd);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(`Unable to get all product, ${(error as Error).message}`);
    }
  }

  //- method to edit product
  async EditProduct(product: Product): Promise<Product> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM products WHERE id=($1)';
      const check = await con.query(ch_sql, [product.id]);

      if (check.rows.length > 0) {
        const sql =
          'UPDATE products SET name=$1, category=$2, photo=$3, price=$4, quantity=$5 WHERE id=$6 RETURNING *';
        const res = await con.query(sql, [
          product.name,
          product.category,
          product.photo,
          product.price,
          product.quantity,
          check.rows[0]['id'],
        ]);
        con.release();
        return res.rows[0];
      } else {
        con.release();
        throw new Error('Product Not found.');
      }
    } catch (error) {
      throw new Error(`Unable to edit product, ${(error as Error).message}`);
    }
  }

  //- method to delete product
  async DeleteProduct(id: string): Promise<Product> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM products WHERE id=($1)';
      const check = await con.query(ch_sql, [id]);

      if (check.rows.length > 0) {
        const sql0 = 'DELETE FROM order_products WHERE product_id=($1)';
        await con.query(sql0, [check.rows[0]['id']]);

        const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
        const res = await con.query(sql, [check.rows[0]['id']]);
        con.release();
        return res.rows[0];
      } else {
        con.release();
        throw new Error('Product Not found.');
      }
    } catch (error) {
      throw new Error(`Unable to delete product, ${(error as Error).message}`);
    }
  }

  //- method to get top most popular products
  async GetMostPopularProducts(count = 5): Promise<Product[]> {
    try {
      const con = await db.connect();
      const sql_cmd =
        'SELECT * FROM products ORDER BY number_of_sales DESC LIMIT ' + count;
      const res = await con.query(sql_cmd);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(
        `Unable to get top most popular products, ${(error as Error).message}`
      );
    }
  }

  //- method to get number in stock
  async NumberInStock(id: string): Promise<number> {
    try {
      const con = await db.connect();
      const sql_cmd = 'SELECT * FROM products WHERE id=($1)';
      const res = await con.query(sql_cmd, [id]);
      con.release();
      return res.rows[0]['quantity'];
    } catch (error) {
      throw new Error(
        `Unable to get number is stock, ${(error as Error).message}`
      );
    }
  }

  //- method to get products by category
  async GetProductsByCategory(name: string): Promise<Product[]> {
    try {
      const con = await db.connect();
      const sql_cmd = 'SELECT * FROM products WHERE category=($1) ';
      const res = await con.query(sql_cmd, [name]);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(`Unable to get products, ${(error as Error).message}`);
    }
  }

  //- method to adjust product quantity
  async AdjustProductQuantity(id: string, quantity: number): Promise<void> {
    try {
      const old_quantity = (await this.GetProduct(id)).quantity;
      const con = await db.connect();
      const sql = 'UPDATE products SET quantity=$1 WHERE id=$2';
      await con.query(sql, [old_quantity + quantity, id]);
      con.release();
    } catch (error) {
      throw new Error(
        `Unable to adjust product quantity, ${(error as Error).message}`
      );
    }
  }

  //- method to update number of sales
  async UpdateNumberOfSales(id: string, quantity: number): Promise<void> {
    try {
      const old_sales = (await this.GetProduct(id)).number_of_sales;
      const con = await db.connect();
      const sql = 'UPDATE products SET number_of_sales=$1 WHERE id=$2';
      await con.query(sql, [old_sales + quantity, id]);
      con.release();
    } catch (error) {
      throw new Error(
        `Unable to update number of sales, ${(error as Error).message}`
      );
    }
  }
}

export default ProductModel;
