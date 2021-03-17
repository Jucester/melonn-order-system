const { Router } = require('express');
const router = Router();
const { getOrders, createOrder, getShippingMethods } = require('../controllers/orders.controller');

router.get('/', getOrders);
router.get('/shipping', getShippingMethods);

router.post('/', createOrder);

module.exports = router;