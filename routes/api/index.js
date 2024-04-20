
const express = require('express');
const router = express.Router();


const productRouter = require('./products');
const cartRouter = require('./cart');


router.use('/products', productRouter);
router.use('/cart', cartRouter);


module.exports = router;
