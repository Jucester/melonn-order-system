const { Router } = require('express');
const router = Router();
const { getOrders, getOrder, createOrder, getShippingMethods, deleteOrder } = require('../controllers/orders.controller');

// Middlewares
const authorization = require('../middlewares/auth');

router.get('/shipping', getShippingMethods);

router.get('/:userId', authorization, getOrders);
router.get('/order/:id', authorization, getOrder);

router.post('/', authorization, createOrder);
router.delete('/delete/:id', authorization, deleteOrder);

module.exports = router;