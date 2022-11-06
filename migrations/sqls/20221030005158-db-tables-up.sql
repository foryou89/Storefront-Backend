CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

CREATE TABLE
    IF NOT EXISTS orders (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        userid uuid NOT NULL,
        status BOOL NOT NULL DEFAULT false,
        created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

CREATE TABLE
    IF NOT EXISTS order_products (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        order_id uuid NOT NULL,
        product_id uuid NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0
    );