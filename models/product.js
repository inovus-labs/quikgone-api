
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
    product_desc: {
        type: String,
        required: true
    },
    product_qty: {
        type: Number,
        required: true
    },
    product_unit: {
        type: String,
        required: false,
        default: "kg",
        enum: ["kg", "g", "l", "ml", "pcs"]
    },
    images: {
        type: Array,
        required: false
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
    price: {
        type: Number,
        required: true
    },
    discount: [
        {
            min_qty: {
                type: Number,
                required: false
            },
            discount: {
                type: Number,
                required: false
            },
            mode: {
                type: String,
                required: false,
                default: "percentage",
                enum: ["percentage", "flat"]
            }
        }
    ],
    status: {
        type: String,
        required: true,
        default: "active",
        enum: ["active", "inactive"]
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