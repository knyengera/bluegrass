import {Router} from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, getOrderByUserId } from "./orderController.js";
import { authenticateToken, verifyAdmin } from "../../middleware/authMiddleware.js";
import { validateData } from "../../middleware/validationMiddleware.js";
import { updateOrderSchema, insertOrderWithItemsSchema } from "../../db/ordersSchema.js";

const router = Router();

router.get('/', authenticateToken, verifyAdmin, getAllOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, validateData(insertOrderWithItemsSchema), createOrder);
router.put('/:id', authenticateToken, verifyAdmin, validateData(updateOrderSchema), updateOrder);
router.delete('/:id', authenticateToken, verifyAdmin, deleteOrder);
router.get('/user/:userId', authenticateToken, getOrderByUserId);
router.post

export default router;