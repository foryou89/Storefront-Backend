# Storefront Backend

Storefront Backend project.

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

## Routes

### Home Page route

```
curl -X GET \
  'http://localhost:3000/' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
}'
```

You should get:

```
Hello from storefront backend project, By: Ahmed Mohamed
```

### API Users routes and Auth route (token required)

- Create new user

```
curl -X POST \
  'http://localhost:3000/api/users' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "first_name" : "Ahmed",
  "last_name" : "Mohamed",
  "user_email" : "forex.terad@gmail.com",
  "user_name" : "foryou89",
  "password" : "zasdzasd"
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "46f74f79-eee6-4c36-a1ed-0e81eee68da6",
    "first_name": "Ahmed",
    "last_name": "Mohamed",
    "user_email": "forex.terad@gmail.com",
    "user_name": "foryou89",
    "created_on": "2022-10-29T18:29:47.770Z",
    "user_block": false,
    "is_admin": false
  },
  "message": "User created successfully"
}
```

- Auth and get token

```
curl -X POST \
  'http://localhost:3000/api/auth' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "user_email" : "forex.terad@gmail.com",
  "password" : "zasdzasd"
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "46f74f79-eee6-4c36-a1ed-0e81eee68da6",
    "first_name": "Ahmed",
    "last_name": "Mohamed",
    "user_email": "forex.terad@gmail.com",
    "user_name": "foryou89",
    "created_on": "2022-10-29T18:29:47.770Z",
    "user_block": false,
    "is_admin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOnsiaWQiOiI0NmY3NGY3OS1lZWU2LTRjMzYtYTFlZC0wZTgxZWVlNjhkYTYiLCJmaXJzdF9uYW1lIjoiQWhtZWQiLCJsYXN0X25hbWUiOiJNb2hhbWVkIiwidXNlcl9lbWFpbCI6ImZvcmV4LnRlcmFkQGdtYWlsLmNvbSIsInVzZXJfbmFtZSI6ImZvcnlvdTg5IiwiY3JlYXRlZF9vbiI6IjIwMjItMTAtMjlUMTg6Mjk6NDcuNzcwWiIsInVzZXJfYmxvY2siOmZhbHNlLCJpc19hZG1pbiI6ZmFsc2V9LCJpYXQiOjE2NjcwNjg0ODN9.yWyRKbtuRHCZZ9RoUtMvrQOxJ4m1eZxTjic6Ui0q_Y8"
  },
  "message": "login successfully"
}
```

- Update User

```
curl -X PATCH \
  'http://localhost:3000/api/users/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {user_token}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "first_name" : "Ahmed",
  "last_name" : "Mohamed Ali",
  "user_email" : "forex.terad@gmail.com",
  "user_name" : "foryou89",
  "password" : "zasdzasd"
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "46f74f79-eee6-4c36-a1ed-0e81eee68da6",
    "first_name": "Ahmed",
    "last_name": "Mohamed Ali",
    "user_email": "forex.terad@gmail.com",
    "user_name": "foryou89",
    "created_on": "2022-10-29T18:29:47.770Z",
    "user_block": false,
    "is_admin": false
  },
  "message": "User updated successfully"
}
```

- Get User by userid

```
curl -X GET \
  'http://localhost:3000/api/users/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "46f74f79-eee6-4c36-a1ed-0e81eee68da6",
    "first_name": "Ahmed",
    "last_name": "Mohamed Ali",
    "user_email": "forex.terad@gmail.com",
    "user_name": "foryou89",
    "created_on": "2022-10-29T18:29:47.770Z",
    "user_block": false,
    "is_admin": false
  },
  "message": "Found user successfully"
}
```

- Get All Users (admin required)

```
curl -X GET \
  'http://localhost:3000/api/users/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "0": {
      "id": "46f74f79-eee6-4c36-a1ed-0e81eee68da6",
      "first_name": "Ahmed",
      "last_name": "Mohamed Ali",
      "user_email": "forex.terad@gmail.com",
      "user_name": "foryou89",
      "created_on": "2022-10-29T18:29:47.770Z",
      "user_block": false,
      "is_admin": true
    }
  },
  "message": "Fount 1 Users"
}
```

- Delete User by userid (admin required)

```
curl -X DELETE \
  'http://localhost:3000/api/users/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "46f74f79-eee6-4c36-a1ed-0e81eee68da6",
    "first_name": "Ahmed",
    "last_name": "Mohamed Ali",
    "user_email": "forex.terad@gmail.com",
    "user_name": "foryou89",
    "created_on": "2022-10-29T18:29:47.770Z",
    "user_block": false,
    "is_admin": true
  },
  "message": "User deleted successfully"
}
```

- Delete all users (admin required)

```
curl -X DELETE \
  'http://localhost:3000/api/users/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {},
  "message": "All users have been successfully deleted"
}
```

- Check if user is blocked (admin required)

```
curl -X GET \
  'http://localhost:3000/api/users/block/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": false,
  "message": "User block is false"
}
```

- Block or unblock user (admin required)

```
curl -X POST \
  'http://localhost:3000/api/users/block/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": true,
  "message": "User block is true"
}
```

- Block or unblock user (admin required)

```
curl -X POST \
  'http://localhost:3000/api/users/block/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": true,
  "message": "User block is true"
}
```

### API Product routes (token required)

- Add new product

```
curl -X POST \
  'http://localhost:3000/api/products/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "test product",
  "category": "test category",
  "photo": "https://via.placeholder.com/300",
  "price": 1000,
  "quantity": 50
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "2cf69e38-97fc-41e0-9a87-97e7fabdc278",
    "name": "test product",
    "category": "test category",
    "photo": "https://via.placeholder.com/300",
    "price": 1000,
    "quantity": 50,
    "number_of_sales": 0
  },
  "message": "Product created successfully"
}
```

- Edit product

```
curl -X PATCH \
  'http://localhost:3000/api/products/{product_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "test product 1",
  "category": "test category",
  "photo": "https://via.placeholder.com/300",
  "price": 1000,
  "quantity": 50
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "2cf69e38-97fc-41e0-9a87-97e7fabdc278",
    "name": "test product 1",
    "category": "test category",
    "photo": "https://via.placeholder.com/300",
    "price": 1000,
    "quantity": 50,
    "number_of_sales": 0
  },
  "message": "Product updated successfully"
}
```

- Get product by id

```
curl -X GET \
  'http://localhost:3000/api/products/{product_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "2cf69e38-97fc-41e0-9a87-97e7fabdc278",
    "name": "test product 1",
    "category": "test category",
    "photo": "https://via.placeholder.com/300",
    "price": 1000,
    "quantity": 50,
    "number_of_sales": 0
  },
  "message": "Found product successfully"
}
```

- Delete product by id

```
curl -X DELETE \
  'http://localhost:3000/api/products/{product_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "2cf69e38-97fc-41e0-9a87-97e7fabdc278",
    "name": "test product 1",
    "category": "test category",
    "photo": "https://via.placeholder.com/300",
    "price": 1000,
    "quantity": 50,
    "number_of_sales": 0
  },
  "message": "Product deleted successfully"
}
```

- Gel all products

```
curl -X GET \
  'http://localhost:3000/api/products/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "0": {
      "id": "b4f74803-f22f-48cc-b2dc-fdcc03b1137c",
      "name": "test product 1",
      "category": "test category",
      "photo": "https://via.placeholder.com/300",
      "price": 1000,
      "quantity": 50,
      "number_of_sales": 0
    },
    "1": {
      "id": "f0011770-c38d-4267-a0e4-f6c970ca743b",
      "name": "test product 2",
      "category": "test category",
      "photo": "https://via.placeholder.com/300",
      "price": 1200,
      "quantity": 40,
      "number_of_sales": 0
    }
  },
  "message": "Fount 2 Products"
}
```

- Gel products by category name

```
curl -X GET \
  'http://localhost:3000/api/products/category/{category_name}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "0": {
      "id": "b4f74803-f22f-48cc-b2dc-fdcc03b1137c",
      "name": "test product 1",
      "category": "test category",
      "photo": "https://via.placeholder.com/300",
      "price": 1000,
      "quantity": 50,
      "number_of_sales": 0
    },
    "1": {
      "id": "f0011770-c38d-4267-a0e4-f6c970ca743b",
      "name": "test product 2",
      "category": "test category",
      "photo": "https://via.placeholder.com/300",
      "price": 1200,
      "quantity": 40,
      "number_of_sales": 0
    }
  },
  "message": "Fount 2 Products"
}
```

- Gel top most popular products

```
curl -X GET \
  'http://localhost:3000/api/products/best/{count_results}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": [
    {
      "id": "aee368c8-6bce-4bfb-be18-ce3d56529458",
      "name": "iPhone 9",
      "category": "smartphones",
      "photo": "https://via.placeholder.com/300",
      "price": 549,
      "quantity": 92,
      "number_of_sales": 8
    },
    {
      "id": "1708201d-7907-4ab8-8aed-a5abe2a0330e",
      "name": "iPhone X",
      "category": "smartphones",
      "photo": "https://via.placeholder.com/300",
      "price": 899,
      "quantity": 93,
      "number_of_sales": 7
    }
  ],
  "message": "Found product successfully"
}
```

### API Orders route and Product order routes (token required)

- Add new order

```
curl -X POST \
  'http://localhost:3000/api/orders/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "userid" : "721de527-ea52-445d-9beb-4329e2a3312f"
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "a4bad403-325b-4db0-91df-75679118113d",
    "userid": "721de527-ea52-445d-9beb-4329e2a3312f",
    "status": false,
    "created_on": "2022-10-30T20:54:59.380Z"
  },
  "message": "Order created successfully"
}
```

- Add order product to order by order id

```
curl -X POST \
  'http://localhost:3000/api/orders/product/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "product_id" : "33c41072-a29a-4307-8bb8-fc4671873831",
  "order_id" : "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
  "quantity" : 1
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "102041d2-428a-4d28-a28c-917f38365c73",
    "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
    "quantity": 1
  },
  "message": "Product added successfully"
}
```

- Edit order product in order by order product id

```
curl -X PATCH \
  'http://localhost:3000/api/orders/product/{order_product_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "product_id" : "33c41072-a29a-4307-8bb8-fc4671873831",
  "order_id" : "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
  "quantity" : 3
}'
```

You should get:

```
 {
  "status": "success",
  "data": {
    "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
    "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "quantity": 3,
    "id": "102041d2-428a-4d28-a28c-917f38365c73"
  },
  "message": "Product edited successfully"
}
```

- show one order product by order product id

```
curl -X GET \
  'http://localhost:3000/api/orders/product/{order_product_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "102041d2-428a-4d28-a28c-917f38365c73",
    "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
    "quantity": 3
  },
  "message": "Done successfully"
}
```

- Delete one order product by order product id

```
curl -X DELETE \
  'http://localhost:3000/api/orders/product/{order_product_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "102041d2-428a-4d28-a28c-917f38365c73",
    "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
    "quantity": 3
  },
  "message": "Product deleted successfully"
}
```

- Edit order by id

```
curl -X PATCH \
  'http://localhost:3000/api/orders/{order_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "userid" : "a93ff750-8251-4a23-b699-a9bda9c2c6b5",
}'
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "userid": "a93ff750-8251-4a23-b699-a9bda9c2c6b5",
    "status": false,
    "created_on": "2022-10-30T19:33:49.297Z"
  },
  "message": "Order updated successfully"
}
```

- Get order by id

```
curl -X GET \
  'http://localhost:3000/api/orders/{order_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "userid": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "status": false,
    "created_on": "2022-10-30T19:33:49.297Z",
    "products": [
      {
        "id": "ac0aaa57-06e9-47c0-8295-3e88c3e02641",
        "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
        "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
        "quantity": 1
      }
    ]
  },
  "message": "Found Order successfully"
}
```

- Get all orders

```
curl -X GET \
  'http://localhost:3000/api/orders/' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "0": {
      "id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
      "userid": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
      "status": false,
      "created_on": "2022-10-30T19:33:49.297Z",
      "products": [
        {
          "id": "ac0aaa57-06e9-47c0-8295-3e88c3e02641",
          "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
          "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
          "quantity": 1
        }
      ]
    }
  },
  "message": "Fount 1 orders"
}
```

- Get orders by userid

```
curl -X GET \
  'http://localhost:3000/api/orders/user/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": [
    {
      "id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
      "userid": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
      "status": false,
      "created_on": "2022-10-30T19:33:49.297Z",
      "products": [
        {
          "id": "ac0aaa57-06e9-47c0-8295-3e88c3e02641",
          "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
          "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
          "quantity": 1
        }
      ]
    }
  ],
  "message": "Fount 1 orders"
}
```

- Get completed orders by userid

```
curl -X GET \
  'http://localhost:3000/api/orders/completed/{userid}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": [
    {
      "id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
      "userid": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
      "status": true,
      "created_on": "2022-10-30T19:33:49.297Z",
      "products": [
        {
          "id": "ac0aaa57-06e9-47c0-8295-3e88c3e02641",
          "order_id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
          "product_id": "33c41072-a29a-4307-8bb8-fc4671873831",
          "quantity": 1
        }
      ]
    }
  ],
  "message": "Fount 1 orders"
}
```

- Delete Order by id

```
curl -X DELETE \
  'http://localhost:3000/api/orders/{order_id}' \
  --header 'Accept: */*' \
  --header 'Authorization: Bearer {token}' \
  --header 'Content-Type: application/json' \
```

You should get:

```
{
  "status": "success",
  "data": {
    "id": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "userid": "aa034624-3e3c-41bb-bce9-c0b27ca18f75",
    "status": true,
    "created_on": "2022-10-30T19:33:49.297Z"
  },
  "message": "Order deleted successfully"
}
```
