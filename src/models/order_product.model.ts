import db from '../database';
import Order_Product from '../types/order_product.typs';
import ProductModel from '../models/products.model';

const productModel = new ProductModel();

class OrderProduct {
  //- method to add new product to order
  async Add(order_Product: Order_Product): Promise<Order_Product> {
    try {
      const product = await productModel.GetProduct(order_Product.product_id);
      if (product.id != '') {
        if (order_Product.quantity <= 0) {
          throw new Error('Quantity must be greater than 0');
        }
        //- adjust product quantity
        await productModel.AdjustProductQuantity(
          product.id,
          order_Product.quantity * -1
        );

        //- update number of sales
        await productModel.UpdateNumberOfSales(
          product.id,
          order_Product.quantity
        );

        //- insert order product to db
        const con = await db.connect();
        const sql_cmd2 = `INSERT INTO order_products (order_id , product_id , quantity ) 
                            values ($1, $2 , $3 ) 
                            RETURNING *`;
        const res = await con.query(sql_cmd2, [
          order_Product.order_id,
          order_Product.product_id,
          order_Product.quantity,
        ]);

        con.release();
        return res.rows[0];
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error(
        `Unable to add product to this order, ${(error as Error).message}`
      );
    }
  }

  //- method to get order product by id
  async GetOne(id: string): Promise<Order_Product> {
    try {
      const con = await db.connect();
      const sql_cmd = 'SELECT * FROM order_products WHERE id=($1)';
      const res = await con.query(sql_cmd, [id]);
      con.release();
      if (res.rows.length) {
        return res.rows[0];
      } else {
        throw new Error('This order product not found.');
      }
    } catch (error) {
      throw new Error(`Can't get order product , ${(error as Error).message}`);
    }
  }

  //- method to get all order product by order id
  async GetAll(orderid: string): Promise<Order_Product[]> {
    try {
      const con = await db.connect();
      const sql_cmd = 'SELECT * FROM order_products WHERE order_id=($1)';
      const res = await con.query(sql_cmd, [orderid]);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(
        `Can't get all order product , ${(error as Error).message}`
      );
    }
  }

  //- method to edit product from order
  async Edit(order_Product: Order_Product): Promise<Order_Product> {
    try {
      const product = await productModel.GetProduct(order_Product.product_id);
      if (product.id) {
        const old = await this.GetOne(order_Product.id);
        if (old.id) {
          //- adjust product quantity
          await productModel.AdjustProductQuantity(
            order_Product.product_id,
            old.quantity
          );

          //- update number of sales
          await productModel.UpdateNumberOfSales(
            order_Product.product_id,
            old.quantity * -1
          );

          //- update order product in db
          const con = await db.connect();
          const sql =
            'UPDATE order_products SET order_id=$1 , product_id=$2 , quantity=$3 WHERE id=$4 RETURNING *';
          await con.query(sql, [
            order_Product.order_id,
            order_Product.product_id,
            order_Product.quantity,
            order_Product.id,
          ]);
          con.release();

          //- adjust product quantity
          await productModel.AdjustProductQuantity(
            product.id,
            order_Product.quantity * -1
          );

          //- update number of sales
          await productModel.UpdateNumberOfSales(
            product.id,
            order_Product.quantity
          );

          return order_Product;
        } else {
          throw new Error('Order product not found');
        }
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error(
        `Unable to update product for this order, ${(error as Error).message}`
      );
    }
  }

  //- method to delete product from order
  async Delete(id: string): Promise<Order_Product> {
    try {
      const con = await db.connect();
      const sql = 'DELETE FROM order_products WHERE id=($1) RETURNING *';
      const res = await con.query(sql, [id]);
      con.release();
      return res.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to delete product for this order, ${(error as Error).message}`
      );
    }
  }
}

export default OrderProduct;
