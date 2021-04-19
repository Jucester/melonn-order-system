import { Router } from 'express';
const router = Router();
import { getOrders, createOrder, getShippingMethods } from '../controllers/orders.controller';

// Middlewares
import authorization from '../middlewares/auth';

router.get('/shipping', getShippingMethods);

router.get('/:userId', getOrders);
//router.get('/order/:id', getOrder);

router.post('/', createOrder);
//router.delete('/delete/:id', deleteOrder);

export default router;