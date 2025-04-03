import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { usersTable } from "./userSchema";
import { ordersTable } from "./ordersSchema";
import { productsTable } from "./productsSchema";
import { orderItemsTable } from "./ordersSchema";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { 
    schema: { 
        usersTable,
        ordersTable,
        productsTable,
        orderItemsTable
    } 
});