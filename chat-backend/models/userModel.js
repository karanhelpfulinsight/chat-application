const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['coach', 'client'], default: 'client' },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },

}, { timeStamps: true })


const User = mongoose.model("User", userSchema);

module.exports = User;