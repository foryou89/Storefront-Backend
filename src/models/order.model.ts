import db from '../database';
import Order from '../types/order.type';

class OrderModel {
  //- method to create new order
  async Create(order: Order): Promise<Order> {
    try {
      //- add order to db
      const con = await db.connect();
      const sql_cmd = `INSERT INTO orders (userid , status ) 
                            values ($1, $2 ) 
                            RETURNING *`;
      const res = await con.query(sql_cmd, [
        order.userid,
        order.status ?? false,
      ]);
      con.release();
      return res.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create new order, ${(error as Error).message}`
      );
    }
  }

  //- method to get one order by id
  async GetOrder(id: string): Promise<Order> {
    try {
      const con = await db.connect();
      const sql_cmd =
        "SELECT orders.id, orders.userid , orders.status , orders.created_on , json_agg(json_build_object('id',order_products.id, 'order_id',order_products.order_id, 'product_id',order_products.product_id , 'quantity',order_products.quantity )) AS products FROM orders JOIN order_products ON order_products.order_id = orders.id WHERE orders.id=($1) GROUP BY orders.id";
      const res = await con.query(sql_cmd, [id]);
      con.release();
      if (res.rows.length) {
        return res.rows[0];
      } else {
        throw new Error('Wrong order id');
      }
    } catch (error) {
      throw new Error(`Unable to get order, ${(error as Error).message}`);
    }
  }

  //- method to get all orders
  async GetAllOrders(): Promise<Order[]> {
    try {
      const con = await db.connect();
      const sql_cmd =
        "SELECT orders.id, orders.userid , orders.status , orders.created_on , json_agg(json_build_object('id',order_products.id, 'order_id',order_products.order_id, 'product_id',order_products.product_id , 'quantity',order_products.quantity )) AS products FROM orders JOIN order_products ON order_products.order_id = orders.id GROUP BY orders.id";
      const res = await con.query(sql_cmd);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(`Unable to get all orders, ${(error as Error).message}`);
    }
  }

  //- method to edit order
  async EditOrder(order: Order): Promise<Order> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM orders WHERE id=($1)';
      const check = await con.query(ch_sql, [order.id]);

      if (check.rows.length > 0) {
        //- sql to update order
        const sql = 'UPDATE orders SET userid=$1 WHERE id=$2 RETURNING *';
        const res = await con.query(sql, [order.userid, check.rows[0]['id']]);

        con.release();
        return res.rows[0];
      } else {
        con.release();
        throw new Error('Order Not found.');
      }
    } catch (error) {
      throw new Error(`Unable to edit order, ${(error as Error).message}`);
    }
  }

  //- method to delete order
  async DeleteOrder(id: string): Promise<Order> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM orders WHERE id=($1)';
      const check = await con.query(ch_sql, [id]);

      if (check.rows.length > 0) {
        const sql0 =
          'DELETE FROM order_products WHERE order_id=($1) RETURNING *';
        await con.query(sql0, [check.rows[0]['id']]);

        const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
        const res = await con.query(sql, [check.rows[0]['id']]);
        con.release();
        return res.rows[0];
      } else {
        con.release();
        throw new Error('Order Not found.');
      }
    } catch (error) {
      throw new Error(`Unable to delete order, ${(error as Error).message}`);
    }
  }

  //- method to delete order by userid
  async DeleteUserOrder(userid: string): Promise<void> {
    try {
      const con = await db.connect();
      const ch_sql = 'SELECT id FROM orders WHERE userid=($1)';
      const check = await con.query(ch_sql, [userid]);

      if (check.rows.length > 0) {
        for (let i = 0; i < check.rows.length; i++) {
          await this.DeleteOrder(check.rows[i]['id']);
        }
      } else {
        con.release();
        throw new Error('Order Not found.');
      }
    } catch (error) {
      throw new Error(`Unable to delete order, ${(error as Error).message}`);
    }
  }

  //- method to get orders by userid
  async GetOrdersByUserid(userid: string): Promise<Order[]> {
    try {
      const con = await db.connect();
      const sql_cmd =
        "SELECT orders.id, orders.userid , orders.status , orders.created_on , json_agg(json_build_object('id',order_products.id, 'order_id',order_products.order_id, 'product_id',order_products.product_id , 'quantity',order_products.quantity )) AS products FROM orders JOIN order_products ON order_products.order_id = orders.id WHERE orders.userid=($1) GROUP BY orders.id";
      const res = await con.query(sql_cmd, [userid]);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(`Unable to get all orders, ${(error as Error).message}`);
    }
  }

  //- method to get completed orders by userid
  async GetCompletedOrdersByUserid(userid: string): Promise<Order[]> {
    try {
      const con = await db.connect();
      const sql_cmd =
        "SELECT orders.id, orders.userid , orders.status , orders.created_on , json_agg(json_build_object('id',order_products.id, 'order_id',order_products.order_id, 'product_id',order_products.product_id , 'quantity',order_products.quantity )) AS products FROM orders JOIN order_products ON order_products.order_id = orders.id WHERE orders.userid=($1) AND orders.status=($2) GROUP BY orders.id";
      const res = await con.query(sql_cmd, [userid, true]);
      con.release();
      return res.rows;
    } catch (error) {
      throw new Error(`Unable to get all orders, ${(error as Error).message}`);
    }
  }

  //- method to change order status by id
  async ChangeOrderStatusToComplete(id: string): Promise<Order> {
    try {
      const con = await db.connect();
      const sql = 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *';
      const res = await con.query(sql, [true, id]);
      con.release();
      return res.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to change order status, ${(error as Error).message}`
      );
    }
  }
}

export default OrderModel;
