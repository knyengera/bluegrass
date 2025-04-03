import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { usersTable } from "./userSchema.js";
import { ordersTable } from "./ordersSchema.js";
import { productsTable } from "./productsSchema.js";
import { orderItemsTable } from "./ordersSchema.js";

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