
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const OrderSchema = new mongoose.Schema({
    
    order_id: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    buyer_id: {
        type: String,
        required: true
    },
    seller_id: {
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
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    total_price: {
        type: Number,
        required: true
    },
    order_status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "confirmed", "rejected", "shipped", "delivered", "cancelled", "completed", "failed"]

        // pending      : when order is created by buyer        (Order is created by buyer and waiting for seller to confirm)
        
        // payment-pending : when payment is pending
        // payment-completed : when payment is completed by buyer
        
        // cancelled    : when order is cancelled by buyer
        // confirmed    : when seller confirms the order        (Notifies carrier to pick up the order)
        // rejected     : when seller rejects the order         (May be due to unavailability of product or any other reason)
        
        // shipped      : when seller ships the order           (Handover the order to carrier for delivery)
        // delivered    : when order is delivered to buyer      (Order is delivered to buyer)
        
        // completed    : when order is completed               (Order is completed successfully)
        // failed       : when order is failed                  (Order is failed due to any reason)

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

}, { collection: 'orders' })

module.exports = mongoose.model('Order', OrderSchema);