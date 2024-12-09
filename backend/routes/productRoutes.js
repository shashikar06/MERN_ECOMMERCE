import express from 'express';
import products from '../data/products.js';
const router = express.Router();
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js'
import { getProductById,getProducts,createProduct,updateProduct,deleteProduct } from '../controllers/productController.js';
import {protect,admin} from '../middleware/authMiddleware.js';

router.get('/', getProducts)

router.get('/:id', getProductById);

router.post('/',protect,admin,createProduct);
router.put('/:id',protect,admin,updateProduct);
router.delete('/:id',protect,admin,deleteProduct);



export default router;
