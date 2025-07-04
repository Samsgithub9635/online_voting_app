import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    aadhaarNum: {
        type: Number,
        required: true,
        unique: true        
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNum: {
        type: String,
        required: true,
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
    }, 
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
        require: true
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});


const User = mongoose.model('User', userSchema);
module.exports = User;