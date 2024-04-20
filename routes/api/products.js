
const express = require('express');
const router = express.Router();
const Product = require('../../models/products');


router.get('/:id', async (req, res) => {
    const productId = req.params['id'];

    try {
        const product = await Product.findOne({product_id:productId}).select('-_id -__v')
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Product found',
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});

router.post('/create', async (req, res) => {

    const { product_name, product_qty, product_owner, product_category, seller_id } = req.body;

    const newProduct = new Product({
        product_name: product_name,
        product_qty: product_qty,
        product_owner: product_owner,
        product_category: product_category,
        seller_id: seller_id
    })
    await newProduct.save()
    return res.status(200).json({
        status: 200,
        message: 'Product created successfully'
    })
});


router.patch('/update/:id', async (req, res) => {
    const productId = req.params['id'];
    const { product_name, product_qty, product_owner, product_category, seller_id } = req.body;

    try {
        const existingProduct = await Product.findOne({ product_id: productId });
        if (!existingProduct) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        // Update the product fields
        existingProduct.product_name = product_name;
        existingProduct.product_qty = product_qty;
        existingProduct.product_owner = product_owner;
        existingProduct.product_category = product_category;
        existingProduct.seller_id = seller_id;

        await existingProduct.save();

        return res.status(200).json({
            status: 200,
            message: 'Product updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
