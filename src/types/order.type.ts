import Order_Product from './order_product.typs';

type Order = {
  id: string;
  userid: string;
  products: Order_Product[];
  status: boolean;
  created_on: string;
};

export default Order;
