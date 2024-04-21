
const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const User = require('../../models/user');
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

        let user_id = req.user.user_id;

        // create new order using data in the cart of the buyer
        await Cart.findOne({ user_id: user_id }).then(async cart => {

            // Get products in the cart
            await Product.find({ product_id: { $in: cart.products.map(p => p.product_id) } }).then(async products => {

                // get full product details
                await User.find({ user_id: { $in: products.map(p => p.product_owner) } }).then(async product_owner => {

                    let total_price = 0, item_price = 0;
                    
                    let cart_items = cart.products.map(p => {
                        let product = products.find(pr => pr.product_id === p.product_id);
                        
                        
                        // calculate price after discount for each product
                        product.discount.map(d => {
                            if (d.mode === "percentage") {
                                item_price = product.price - (product.price * d.discount);
                            } else {
                                item_price = product.price - d.discount;
                            }
                        });
                        
                        let new_total = item_price * p.qty;
                        total_price += new_total;

                        
                        // console.log({
                        //     "Original per-price": product.price,
                        //     "Discounted per-price": item_price,
                        //     "Original Final price": product.price * p.qty,
                        //     "Discounted Final price": new_total,
                        // });


                        return {
                            product_id: product.product_id,
                            qty: p.qty,
                            price: item_price
                        };
                    });

                    let ordersArray = [];


                    // create seperate orders for each seller
                    let seller_ids = product_owner.map(p => p.user_id);

                    seller_ids.map(async seller_id => {
                        let seller_products = cart_items.filter(p => products.find(pr => pr.product_id === p.product_id).product_owner === seller_id);
                        let seller_total = seller_products.reduce((a, b) => a + (b.price * b.qty), 0);

                        let order = new Order({
                            buyer_id: user_id,
                            seller_id: seller_id,
                            products: seller_products,
                            total_price: seller_total,
                            order_status: "pending"
                        });

                        ordersArray.push(order);


                        // save orders
                        await order.save().then(async order => {
                            console.log("\nOrder created successfully", order, "\n");
                        }).catch(error => {
                            return res.status(400).json({
                                status: 400,
                                message: "Error creating order",
                                error: error
                            });
                        });
                    });


                    // update the product quantity after creating orders
                    products.map(async product => {

                        let cart_product = cart_items.find(p => p.product_id === product.product_id);
                        let new_qty = product.product_qty - cart_product.qty;

                        await Product.findOneAndUpdate({ product_id: product.product_id }, { product_qty: new_qty }).then(async product => {
                            console.log("Product quantity updated successfully", product);
                        }).catch(error => {
                            return res.status(400).json({
                                status: 400,
                                message: "Error updating product quantity",
                                error: error
                            });
                        });
                        
                    });


                    // clear cart after creating orders
                    await Cart.findOneAndDelete({ user_id: user_id }).then(async cart => {
                        console.log("Cart cleared successfully", cart);
                    }).catch(error => {
                        return res.status(400).json({
                            status: 400,
                            message: "Error clearing cart",
                            error: error
                        });
                    });


                    // return response
                    return res.status(201).json({
                        status: 201,
                        message: "Order created successfully",
                        data: {
                            orders: {
                                count: ordersArray.length,
                                orders : ordersArray
                            },
                            total_price: total_price,
                            order_status: "pending"
                        }
                    });


                }).catch(error => {
                    return res.status(400).json({
                        status: 400,
                        message: "Error fetching product owner",
                        error: error
                    });
                });


            }).catch(error => {
                return res.status(400).json({
                    status: 400,
                    message: "Error fetching products",
                    error: error
                });
            });


        }).catch(error => {
            return res.status(400).json({
                status: 400,
                message: "Error fetching cart",
                error: error
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
