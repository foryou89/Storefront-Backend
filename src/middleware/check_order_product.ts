import { Request, Response, NextFunction } from 'express';
import ProductModel from '../models/products.model';
import Order_Product from '../types/order_product.typs';

const productModel = new ProductModel();

const checkOrderProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<string, Record<string, string>>> => {
  try {
    if (
      req.method.toLowerCase() == 'post' ||
      req.method.toLowerCase() == 'patch'
    ) {
      const order_Product = req.body as Order_Product;

      //- check product id;
      const prodcut = await productModel.GetProduct(order_Product.product_id);
      if (prodcut.id != order_Product.product_id) {
        return res
          .status(400)
          .json({ status: 400, message: 'Wrong product id' });
      }

      //- check quantity number mast > 0
      if (order_Product.quantity <= 0) {
        return res.status(400).json({
          status: 400,
          message: `You must choose at least one quantity of this product`,
        });
      }

      //- check available quantity
      if (order_Product.quantity > prodcut.quantity) {
        return res.status(400).json({
          status: 400,
          message: `The available quantity for this product is ${prodcut.quantity}`,
        });
      }
    }

    return next();
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: `Error adding order product, ${(err as Error).message}`,
    });
  }
};

export default checkOrderProduct;
