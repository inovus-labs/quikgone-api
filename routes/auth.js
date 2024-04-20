
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');
const jwt = require('jsonwebtoken');



/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /auth/register
**/


router.post('/register', async (req, res) => {
    try {

        let { first_name, last_name, mobile, email, password, dob} = req.body;
        let user = await User.findOne({ email: email });

        if (user) {
            return res.status(400).json({
                status: 400,
                message: 'This email is already registered'
            })
        } else {

            const salt = await bcrypt.genSalt(10)
            const salt_password = await bcrypt.hash(password, salt)

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                mobile: mobile,
                email: email,
                password: salt_password,
                dob: dob
            })
            
            await newUser.save()
            return res.status(200).json({
                status: 200,
                message: 'User created successfully'
            })

        }
    } catch (err) {
        return res.status(400).json({
            status: 400,
            message: 'Error creating user',
            error: err
        })
    }
});



/**
 * @route   POST /auth/login
 * @desc    Login a user
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 401, 500
 * 
 * @example /auth/login
**/

router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 401,
                error: 'User not found'
            });
        }

        // Check if password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid password'
            });
        }

        // Check if user account is active
        if (user.status === 'inactive') {
            return res.status(401).json({
                status: 401,
                error: 'The user account is inactive. Please contact the administrator'
            });
        } else if (user.status === 'suspended') {
            return res.status(401).json({
                status: 401,
                error: 'The user account is suspended. Please contact the administrator'
            });
        } else if (user.status === 'deleted') {
            return res.status(401).json({
                status: 401,
                error: 'The user account is deleted. Please contact the administrator'
            });
        }
        

        // Create and assign a token to the user
        const token = jwt.sign({ email: email, user_id: user.user_id }, process.env.TOKEN_SECRET, {
            expiresIn: '24h'
        });

        
        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            token: token
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error logging in user',
            error: error.err
        });
    }
})



module.exports = router;