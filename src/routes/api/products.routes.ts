import { NextFunction, Request, Response, Router } from 'express';
import ProductModel from '../../models/products.model';
import checkAuthToken from '../../middleware/check_auth_token';
import Product from '../../types/product.type';

const routes = Router();
const productModel = new ProductModel();
//- route for get all products
routes
  .route('/')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await productModel.GetAllProducts();
        res.json({
          status: 'success',
          data: { ...action },
          message:
            action.length > 0
              ? 'Fount ' + action.length + ' Products'
              : 'There are no Products',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for get one product from db by product id
routes
  .route('/:id')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await productModel.GetProduct(req.params.id as string);
        res.json({
          status: 'success',
          data: action,
          message: 'Found product successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for add new products to db
routes
  .route('/')
  .post(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await productModel.Create(req.body);
        res.json({
          status: 'success',
          data: { ...action },
          message: 'Product created successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for update product
routes
  .route('/:id')
  .patch(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const prod = req.body as Product;
        prod.id = req.params.id as string;
        const action = await productModel.EditProduct(prod);
        res.json({
          status: 'success',
          data: { ...action },
          message: 'Product updated successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for delete product
routes
  .route('/:id')
  .delete(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await productModel.DeleteProduct(
          req.params.id as string
        );
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

//- route for get products by category
routes
  .route('/category/:name')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await productModel.GetProductsByCategory(
          req.params.name as string
        );
        res.json({
          status: 'success',
          data: action,
          message: 'Found product successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

//- route for get top most popular products
routes
  .route('/best/:count')
  .get(
    checkAuthToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const action = await productModel.GetMostPopularProducts(
          parseInt(req.params.count as string)
        );
        res.json({
          status: 'success',
          data: action,
          message: 'Found product successfully',
        });
      } catch (err) {
        next(err);
      }
    }
  );

export default routes;
