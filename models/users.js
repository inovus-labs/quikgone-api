
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const UserSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    mobile:{
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
    },
    dob:{
        type:String,
        required:true
    },
    status: {
        type: String,
        required: true,
        default: "active",
        enum: ["active", "inactive", "suspended", "deleted"]
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
    
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema);