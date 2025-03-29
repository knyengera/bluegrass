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

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/name/:name', getProductByName);
router.get('/category/:category', getProductByCategory);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;