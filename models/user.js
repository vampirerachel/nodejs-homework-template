const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
    },
    verificationToken: { 
    type: String,
    required: false,
  },
  verify: { 
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;