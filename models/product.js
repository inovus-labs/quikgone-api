
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const ProductSchema = new mongoose.Schema({
    
    product_id: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    product_name: {
        type: String,
        required: true
    },
    product_qty: {
        type: String,
        required: true
    },
    product_owner: {
        type: String,
        required: true
    },
    product_category: {
        type: String,
        required: true,
        default: "fruits",
        enum: ["fruits", "vegetables", "packed_foods"]
    },
    expiry_date: {
        type: Date,
        required: false,
        default: Date.now
    },
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

}, { collection: 'products' })

module.exports = mongoose.model('Product', ProductSchema);