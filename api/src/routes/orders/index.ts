import {Router} from "express";

const router = Router();

router.get('/', (req, res) => {
    res.send("The List of Orders");
});

router.get('/:id', (req, res) => {
    res.send(`Order ID is ${req.params.id}`);
});

router.post('/', (req, res) => {
    res.send("Creating a new order");
});

router.put('/:id', (req, res) => {
    res.send(`Updating order ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    res.send(`Deleting order ${req.params.id}`);
});

export default router;