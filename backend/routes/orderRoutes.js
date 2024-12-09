import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getMyorders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDeliver,
    getOrders
} from '../controllers/ordercontroller.js';
import { protect,admin } from '../middleware/authMiddleware.js';


router.post('/',protect,addOrderItems);
router.get('/',protect,admin,getOrders);
router.get('/mine',protect,getMyorders);
router.get('/:id',protect,getOrderById);
router.put('/:id/pay',protect,admin,updateOrderToPaid);
router.put('/:id/deliver',protect,admin,updateOrderToDeliver);


export default router;


