
const express = require('express');
const router = express.Router();


const productRouter = require('./products');
const CartRouter = require('./cart');
const OrderRouter = require('./orders');


router.use('/products', productRouter);
router.use('/cart', CartRouter);
router.use('/orders', OrderRouter);


module.exports = router;
