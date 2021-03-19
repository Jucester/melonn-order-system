const { Router } = require('express');
const router = Router();
const { getOrders, getOrder, createOrder, getShippingMethods, deleteOrder } = require('../controllers/orders.controller');

router.get('/', getOrders);
router.get('/order/:id', getOrder);

router.get('/shipping', getShippingMethods);

router.post('/', createOrder);

router.delete('/delete/:id', deleteOrder);

module.exports = router;