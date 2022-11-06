# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Users

- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## dependencies

To install the project dependencies run `yarn`

- express
- express-rate-limit
- dotenv
- bcrypt
- db-migrate
- db-migrate-pg
- jsonwebtoken
- jasmine
- morgan
- helmet

## .env File

```
#for express server
SERVER_PORT = 3000

#for database connection
DB_USES=developer
DB_HOST=127.0.0.1
DB_REAL_NAME=store
DB_TEST_NAME=store_test
DB_USER=postgres
DB_PASS=zasdzasd
DB_PORT=5432

#for hash password
BCRYPT_PASSWORD=for-udacity
SALT_ROUNDS=10

#for authenticate token
TOKEN_SECRET=udacity-token
```

## scripts

To start on nodemon

```
yarn start
```

To start prettier format

```
yarn format
```

Test code by jasmine

```
yarn test
```

Test code by jasmine

```
yarn test
```

To use ESLint

```
yarn lint
```

To use ESLint and fix errors

```
yarn lint-fix
```

To build project

```
yarn build
```

To build project and run server

```
yarn start-prod
```

## DB Creation and Migrations

Use `postgres` database and create two database `store` for real and `store_test` for test.

run `npx db-migrate up` to create tables `users` , `products` , `orders` , `order_products` in database.

test database is `store_test`
real database is `store`

databases connection information in `.env` file.

to create migration for users, products , orders and order_products

```
npx db-migrate create db-tables --sql-file
```

### tables

use uuid-ossp extension to generate unique id

```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

- users table

```
CREATE TABLE
    IF NOT EXISTS users (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_name VARCHAR(255) NOT NULL,
        created_on TIMESTAMP NOT NULL DEFAULT NOW(),
        user_block BOOL NOT NULL DEFAULT false,
        is_admin BOOL NOT NULL DEFAULT false,
        password VARCHAR(255) NOT NULL,
        token TEXT NULL
    );
```

- products table

```
CREATE TABLE
    IF NOT EXISTS products (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(255) NOT NULL,
        photo VARCHAR(255) NOT NULL,
        price NUMERIC(9, 2) NOT NULL DEFAULT 0,
        quantity INTEGER NOT NULL DEFAULT 0,
        number_of_sales INTEGER NOT NULL DEFAULT 0
    );
```

- orders table

```
CREATE TABLE
    IF NOT EXISTS orders (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        userid uuid NOT NULL,
        status BOOL NOT NULL DEFAULT false,
        created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
```

- order_products table

```
CREATE TABLE
    IF NOT EXISTS order_products (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        order_id uuid NOT NULL,
        product_id uuid NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0
    );
```

## Models

### User Model

You can `create` , `update` , `delete` , `get` , `change to admin` and `block` user

- .create(user_data)
  Method to create new user, It's return new User data.

- .updateUser(user_data)
  Method to update user, It's return updated User data.

- .deleteUser(userid)
  Method to delete user by id, It's return deleted User data.

- .deleteAllUser()
  Method to delete all users.

- .getUserByID(userid)
  Method to get user by id, It's return User data.

- .getAllUsers()
  Method to get all users, It's return list of User data.

- .checkUserBlock(userid)
  Method to check if user is blocked, It's return true or false.

- .changeUserBlock(userid)
  Method to block or unblock user, It's return true or false.

- .getUserType(userid)
  Method to get user type, It's return true if is admin or false if not admin.

- .changeUserType(userid)
  Method to change user type, It's return true if is admin or false if not admin.

- .getUserByToken(token)
  Method to get user by auth token, It's return User data.

### Auth Model

You can `authenticate user` and `save token to user database`

- auth(user_email , password)
  Method to authenticate user and get token.

- saveToken(user_email , token)
  Method to save token to user database.

### Products Model

You can `create` , `update` , `delete` , `get` , `get most popular` , `get products by category name` , `adjust product quantity` , `update number of sales` , `get product quantity in stock` and `update number of sales`

- .Create(product_data)
  Method to create new product, It's return new Product data.

- .EditProduct(product_data)
  Method to update product, It's return updated Product data.

- .DeleteProduct(productid)
  Method to delete product by id, It's return deleted Product data.

- .GetProduct(productid)
  Method to get product by product id, It's return Product data.

- .GetAllProducts()
  Method to get all products, It's return list of Product data.

- .GetMostPopularProducts(number of count)
  Method to get top most popular products, It's return list of Product data.

- .GetProductsByCategory(name of category)
  Method to get products by category name, It's return list of Product data.

- .AdjustProductQuantity(productid , number of quantity)
  Method to adjust product quantity.

- .NumberInStock(productid)
  Method get product quantity in stock, It's return number of quantity.

- .UpdateNumberOfSales(productid , number of new sales)
  Method to update number of sales.

### Orders Model

You can `create` , `update` , `delete` , `get` , `get orders by userid` , `get completed orders by userid` and `change order status to complete`

- .Create(order_data)
  Method to create new order, It's return new Order data.

- .EditOrder(order_data)
  Method to update Order, It's return updated Order data.

- .DeleteOrder(orderid)
  Method to delete Order by id, It's return deleted Order data.

- .GetOrder(orderid)
  Method to get Order by order id, It's return Order data.

- .GetAllOrders()
  Method to get all orders, It's return list of Order data.

- .GetOrdersByUserid(userid)
  Method to get all orders by user id, It's return list of Order data.

- .GetCompletedOrdersByUserid(userid)
  Method to get all completed orders by userid, It's return list of Order data.

- .ChangeOrderStatusToComplete(userid)
  Method to change order status to complete, It's return this Order data.

### Order-Product Model

You can `Add` , `GetOne` , `GetAll` , `Edit` and `Delete` order_product

- .Add(Order_Product)
  Method to add new product to order, It's return new Order_Product.

- .GetOne(order_product_id)
  Method to get order product by id, It's return Order_Product.

- .GetAll(orderid)
  Method to get all order product by order id, It's return array of Order_Product.

- .Edit(Order_Product)
  Method to edit product from order, It's return updated Order_Product.

- .Delete(order_product_id)
  Method to delete product from order, It's return deleted Order_Product.
