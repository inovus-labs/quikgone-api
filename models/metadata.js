
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const MetadataSchema = new mongoose.Schema({
    
    meta_id: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    user_id: {
        type: String,
        required: true
    },

    // Company Details (Seller)
    company_name: {
        type: String,
        required: true
    },
    company_address: {
        type: String,
        required: true
    },
    company_city: {
        type: String,
        required: true
    },
    company_state: {
        type: String,
        required: true
    },

    // Vehicle Details (Carrier)
    vehicle_type: {
        type: String,
        required: true
    },
    vehicle_number: {
        type: String,
        required: true
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

}, { collection: 'metadata' })

module.exports = mongoose.model('Metadata', MetadataSchema);