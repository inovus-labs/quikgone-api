
const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const Cart = require('../../models/cart');
const verifyToken = require('../../middleware/authentication');



/**
 * @route   GET /cart
 * @desc    Get all cart items
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /cart
**/

router.get('/', verifyToken, async (req, res) => {
    try {

        const user_id = req.user.user_id;

        await Cart.findOne({ user_id: user_id }).select('-_id -__v').then(async cart => {

            if (!cart) {
                return res.status(404).json({
                    status: 404,
                    message: "Cart is empty"
                });
            }

            await Product.find({ product_id: { $in: cart.products.map(p => p.product_id) } }).then(products => {

                let cart_items = cart.products.map(p => {
                    let product = products.find(pr => pr.product_id === p.product_id);
                    return {
                        
                        product_id: product.product_id,
                        product_name: product.product_name,
                        product_qty: Number(product.product_qty),
                        images: product.images,
                        price: Number(product.price),
                        discount: product.discount,
                        qty: p.qty

                    };
                });

                return res.status(200).json({
                    status: 200,
                    message: "Cart items fetched successfully",
                    cart: cart_items
                });

            }).catch(error => {
                return res.status(400).json({
                    status: 400,
                    message: "Error fetching products",
                    error: error
                });

            });

        });

    } catch (error) {

        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });

    }
});




/**
 * @route   POST /cart
 * @desc    Add a product to cart
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /cart
 * @body    { product_id, qty }
 * @header  { Authorization: Bearer <token> }
**/

router.post('/', verifyToken, async (req, res) => {
    try {

        const user_id = await req.user.user_id;
        let { product_id, qty } = req.body;

        await Cart.findOne({ user_id: user_id }).then(async cart => {
            if (!cart) {
                cart = new Cart({
                    user_id: user_id,
                    products: [
                        {
                            product_id: product_id,
                            qty: qty
                        }
                    ]
                });
            } else {
                let product = cart.products.find(p => p.product_id === product_id);
                if (product) {
                    product.qty += qty;
                } else {
                    cart.products.push({
                        product_id: product_id,
                        qty: qty
                    });
                }
            }
            await cart.save();
            return res.status(200).json({
                status: 200,
                message: "Product added to cart successfully"
            });
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});




/**
 * @route   PATCH /cart/:product_id
 * @desc    Update a product in cart
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /cart/:product_id
 * @body    { qty }
 * @header  { Authorization: Bearer <token> }
**/

router.patch('/:product_id', verifyToken, async (req, res) => {
    try {

        const user_id = req.user.user_id;
        const product_id = req.params.product_id;
        const { qty } = req.body;

        let cart = await Cart.findOne({ user_id: user_id });

        if (!cart) {
            return res.status(404).json({
                status: 404,
                message: "Cart is empty"
            });
        }

        let product = cart.products.find(p => p.product_id === product_id);
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: "Product not found in cart"
            });
        }

        product.qty = qty;

        // Check if product qty is 0
        if (product.qty === 0) {
            cart.products = cart.products.filter(p => p.product_id !== product_id);
        }

        await cart.save();

        // Check if products array is empty
        if (cart.products.length === 0) {
            await Cart.findOneAndDelete({ user_id: user_id });
        }

        return res.status(200).json({
            status: 200,
            message: "Product updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});






module.exports = router;
