import express, { json, urlencoded } from "express";
import productsRoutes from "./routes/products";
import ordersRoutes from "./routes/orders";
import authRoutes from "./routes/auth";
const app = express();
const port = 3000;

app.use(urlencoded({ extended: false }));
app.use(json());

// Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("Pantry by Marble Api");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
