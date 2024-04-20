
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const UserSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    }
    
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema);