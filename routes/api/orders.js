
const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const Order = require('../../models/order');
const verifyToken = require('../../middleware/authentication');




/**
 * @route   GET /orders
 * @desc    Get all orders
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /orders
**/

router.get('/', verifyToken, async (req, res) => {
    try {

        const order = await Order.find({}).select('-_id -__v')
        if (!order) {
            return res.status(404).json({
                status: 404,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Orders found successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});




/**
 * @route   GET /orders/buy/:user_id
 * @desc    Get orders by buyer_id
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /orders/buy/:user_id
**/

router.get('/buy/:user_id', verifyToken, async (req, res) => {
    try {

        const order = await Order.find({ buyer_id: req.params.user_id }).select('-_id -__v')
        if (!order) {
            return res.status(404).json({
                status: 404,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Orders found successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});




/**
 * @route   GET /orders/sell/:user_id
 * @desc    Get orders by seller_id
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /orders/sell/:user_id
**/

router.get('/sell/:user_id', verifyToken, async (req, res) => {
    try {

        const order = await Order.find({ seller_id: req.params.user_id }).select('-_id -__v')
        if (!order) {
            return res.status(404).json({
                status: 404,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Orders found successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});




/**
 * @route   POST /orders
 * @desc    Create new order
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  201, 400
 * 
 * @example /orders
**/

router.post('/', verifyToken, async (req, res) => {
    try {

        console.log(req.user.user_id);
        return;

        // create new order using data in the cart of the buyer
        await Cart.findOne({ user_id: req.user.user_id }, async (err, cart) => {
            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: err
                });
            }

            if (!cart) {
                return res.status(404).json({
                    status: 404,
                    message: 'Cart not found'
                });
            }
            
            // get product_owners from products in cart and create order for each product_owner
            let product_owners = [];
            cart.products.forEach(product => {
                if (!product_owners.includes(product.product_owner)) {
                    product_owners.push(product.product_owner);
                }
            });

            // create order for each product_owner
            product_owners.forEach(async product_owner => {

                let products = cart.products.filter(product => product.product_owner === product_owner);
                let total_price = 0;
                products.forEach(product => {
                    total_price += product.price * product.qty;
                });

                const order = new Order({
                    buyer_id: req.user.user_id,
                    seller_id: product_owner,
                    products: products,
                    total_price: total_price,
                    order_status: "pending"
                });

                await order.save();

                // clear cart
                await Cart.findOneAndDelete({ buyer_id: req.user.user_id }).exec().then(() => {
                    return res.status(201).json({
                        status: 201,
                        message: "Order created successfully",
                        data: order
                    });
                }).catch(err => {
                    return res.status(400).json({
                        status: 400,
                        message: err
                    });
                });

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
 * @route   PUT /orders/:order_id
 * @desc    Update order by order_id
 * @access  Private
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /orders/:order_id
**/

router.put('/:order_id', verifyToken, async (req, res) => {
    try {

        const order = await Order.findOneAndUpdate({ _id: req.params.order_id },
            {
                // buyer_id: req.body.buyer_id,
                // seller_id: req.body.seller_id,
                // products: req.body.products,
                // total_price: req.body.total_price,
                order_status: req.body.order_status
            }, { new: true });

        if (!order) {
            return res.status(404).json({
                status: 404,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Order updated successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
});



module.exports = router;
