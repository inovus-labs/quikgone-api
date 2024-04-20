
const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const verifyToken = require('../../middleware/authentication');




/**
 * @route   GET /products
 * @desc    Get all products
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /products
**/

router.get('/', async (req, res) => {
    try {

        const product = await Product.find({}).select('-_id -__v')
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Product found successfully",
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});




/**
 * @route   GET /products/:id
 * @desc    Get a single product by id
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /products/123
**/

router.get('/:id', async (req, res) => {

    const productId = req.params['id'];

    try {
        const product = await Product.findOne({ product_id: productId }).select('-_id -__v')
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




/**
 * @route   POST /products/create
 * @desc    Create a new product
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /products/create
**/

router.post('/create', verifyToken, async (req, res) => {

    const { product_name, product_desc, product_qty, images, product_category, expiry_date } = req.body;

    const newProduct = new Product({
        product_name: product_name,
        product_desc: product_desc,
        product_qty: product_qty,
        images: images,
        product_owner: req.user.user_id,
        product_category: product_category,
        expiry_date: expiry_date
    })
    
    await newProduct.save()
    return res.status(200).json({
        status: 200,
        message: 'Product created successfully'
    })
});




/**
 * @route   PATHC /products/update/:id
 * @desc    Update a product by id
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /products/update/123
**/

router.patch('/update/:id', verifyToken, async (req, res) => {

    const productId = req.params['id'];
    const { product_name, product_desc, product_qty, images, product_category } = req.body;

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
        existingProduct.product_desc = product_desc;
        existingProduct.product_qty = product_qty;
        existingProduct.images = images;
        existingProduct.product_category = product_category;

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




/**
 * @route   DELETE /products/delete/:id
 * @desc    Delete a product by id
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /products/delete/123
**/

router.delete('/delete/:id', verifyToken, async (req, res) => {

    const productId = req.params['id'];
    try {
        const deletedProduct = await Product.findOneAndDelete({ product_id: productId });
        if (!deletedProduct) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }

});




module.exports = router;
