
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const CartSchema = new mongoose.Schema({
    
    cart_id: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    user_id: {
        type: String,
        required: true
    },
    products: [
        {
            product_id: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }
    ],
    created_at: {
        type: Date,
        required: false,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: false,
        default: Date.now
    }

}, { collection: 'cart' })

module.exports = mongoose.model('Cart', CartSchema);