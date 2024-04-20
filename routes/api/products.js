
const express = require('express');
const router = express.Router();
const Product = require('../../models/products');

router.post('/create',async(req,res)=>{

    const { product_name,product_qty,product_owner,product_category,seller_id } = req.body;

    const newProduct = new Product({
        product_name:product_name,
        product_qty:product_qty,
        product_owner:product_owner,
        product_category:product_category,
        seller_id:seller_id
    })
    await newProduct.save()
    return res.status(200).json({
        status: 200,
        message: 'Product created successfully'
    })} );


module.exports = router;
