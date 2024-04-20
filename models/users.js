
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const UserSchema = new mongoose.Schema({

    
    
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema);