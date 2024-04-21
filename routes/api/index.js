
const express = require('express');
const router = express.Router();


const productRouter = require('./products');
const CartRouter = require('./cart');
const OrderRouter = require('./orders');
const UsersRouter = require('./users');


router.use('/products', productRouter);
router.use('/cart', CartRouter);
router.use('/orders', OrderRouter);
router.use('/users', UsersRouter);


module.exports = router;
