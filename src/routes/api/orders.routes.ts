import { NextFunction, Request, Response, Router } from 'express';
import checkAuthToken from '../../middleware/check_auth_token';
import OrderModel from '../../models/order.model';
import OrderProduct from '../../models/order_product.model';
import checkOrderProduct from '../../middleware/check_order_product';
import Order from '../../types/order.type';
import Order_Product from '../../types/order_product.typs';

const routes = Router();
const orderModel = new OrderModel();
const orderProduct = new OrderProduct();

//- route for get all orders
routes
  .route('/')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderModel.GetAllOrders();

        res.json({
          status: 'success',
          data: { ...action },
          message:
            action.length > 0
              ? 'Fount ' + action.length + ' orders'
              : 'There are no orders',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for get one order from db by order id
routes
  .route('/:id')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderModel.GetOrder(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'Found Order successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for add new order to db
routes
  .route('/')
  .post(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderModel.Create(req.body);
        res.json({
          status: 'success',
          data: { ...action },
          message: 'Order created successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for update order
routes
  .route('/:id')
  .patch(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const ordr = req.body as Order;
        ordr.id = req.params.id as string;
        const action = await orderModel.EditOrder(ordr);
        res.json({
          status: 'success',
          data: { ...action },
          message: 'Order updated successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for delete order
routes
  .route('/:id')
  .delete(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderModel.DeleteOrder(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'Order deleted successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for get orders by userid
routes
  .route('/user/:userid')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderModel.GetOrdersByUserid(
          req.params.userid as string
        );
        res.json({
          status: 'success',
          data: action,
          message:
            action.length > 0
              ? 'Fount ' + action.length + ' orders'
              : 'There are no orders',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for get completed orders by userid
routes
  .route('/completed/:userid')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderModel.GetCompletedOrdersByUserid(
          req.params.userid as string
        );
        res.json({
          status: 'success',
          data: action,
          message:
            action.length > 0
              ? 'Fount ' + action.length + ' orders'
              : 'There are no orders',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route to get order product by id
routes
  .route('/product/:id')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderProduct.GetOne(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'Done successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route to add order product
routes
  .route('/product/')
  .post(
    checkAuthToken,
    checkOrderProduct,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderProduct.Add(req.body);
        res.json({
          status: 'success',
          data: action,
          message: 'Product added successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route to edit order product
routes
  .route('/product/:id')
  .patch(
    checkAuthToken,
    checkOrderProduct,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const op = req.body as Order_Product;
        op.id = req.params.id as string;
        const action = await orderProduct.Edit(req.body);
        res.json({
          status: 'success',
          data: action,
          message: 'Product edited successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route to delete order product
routes
  .route('/product/:id')
  .delete(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await orderProduct.Delete(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'Product deleted successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );
export default routes;
