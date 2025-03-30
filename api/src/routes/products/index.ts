import { Router, Request, Response } from "express";
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductByName, 
    getProductByCategory,
    getProductCategories,
    getProductCategoryById
} from "./productsController.js";
import { validateData } from "../../middleware/validationMiddleware.js";
import { createProductSchema, updateProductSchema } from "../../db/productsSchema.js";
import { authenticateToken, verifyAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

router.get('/', getAllProducts);
router.get('/categories', getProductCategories);
router.get('/categories/:categoryId', getProductCategoryById);
router.get('/categories/:categoryId/products', getProductByCategory);
router.get('/search/name/:name', getProductByName);
router.get('/:id', getProductById);
router.post('/', authenticateToken, verifyAdmin, validateData(createProductSchema), createProduct);
router.put('/:id', authenticateToken, verifyAdmin, validateData(updateProductSchema), updateProduct);
router.delete('/:id', authenticateToken, verifyAdmin, deleteProduct);

export default router;