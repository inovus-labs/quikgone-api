
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const ProductSchema = new mongoose.Schema({
    product_id:{
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    product_name:{
        type:String,
        required:true
    },
    product_qty:{
        type:String,
        required:true
    },
    product_owner:{
        type:String,
        required:true
    }
    
    
}, { collection: 'products' })

module.exports = mongoose.model('Product', ProductSchema);