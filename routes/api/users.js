
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const verifyToken = require('../../middleware/authentication');




/**
 * @route   GET /users
 * @desc    Get all products
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /products
**/

router.get('/', verifyToken, async (req, res) => {
    try {

        const product = await User.find({}).select('-_id -__v')
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: "User found successfully",
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
 * @route   GET /users/:id
 * @desc    Get a single user by id
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /users/123
**/

router.get('/:id', verifyToken, async (req, res) => {

    const userId = req.params['id'];

    try {
        const product = await User.findOne({ user_id: userId }).select('-_id -__v')
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'User found',
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
 * @route   GET /users/me
 * @desc    Get my user details
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /users/me
**/

router.get('/me', verifyToken, async (req, res) => {

    const userId = req.user.user_id;

    try {
        const product = await User.findOne({ user_id: userId }).select('-_id -__v')
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'User found',
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});





module.exports = router;
