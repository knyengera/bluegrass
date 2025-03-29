import {Router} from "express";

const router = Router();

router.get('/', (req, res) => {
    res.send("The List of Products");
});

router.get('/:id', (req, res) => {
    res.send(`Product ID is ${req.params.id}`);
});

router.post('/', (req, res) => {
    res.send("Creating a new product");
});

router.put('/:id', (req, res) => {
    res.send(`Updating product ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    res.send(`Deleting product ${req.params.id}`);
});

export default router;