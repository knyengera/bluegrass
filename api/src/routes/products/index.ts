import {Router} from "express";
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductByName, 
    getProductByCategory 
} from "./productsController";
import { validateData } from "../../middleware/validationMiddleware";
import { createProductSchema, updateProductSchema } from "../../db/productsSchema";

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/name/:name', getProductByName);
router.get('/category/:category', getProductByCategory);
router.post('/', validateData(createProductSchema), createProduct);
router.put('/:id', validateData(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;