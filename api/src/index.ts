import express, { json, urlencoded } from "express";
import productsRoutes from "./routes/products/index.js";
import ordersRoutes from "./routes/orders/index.js";
import authRoutes from "./routes/auth/index.js";
import usersRoutes from "./routes/users/index.js";
import serverless from "serverless-http";
const app = express();
const port = 3000;

app.use(urlencoded({ extended: false }));
app.use(json());

// Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.get("/", (req, res) => {
    res.send("Pantry by Marble Api");
});

if (process.env.NODE_ENV == 'dev') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export const handler = serverless(app);