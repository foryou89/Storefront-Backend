import express from 'express';
import usersRoutes from './api/users.routes';
import authRoutes from './api/auth.routes';
import productsRoutes from './api/products.routes';
import ordersRoutes from './api/orders.routes';

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);
routes.use('/products', productsRoutes);
routes.use('/orders', ordersRoutes);

export default routes;
