const mongoose = require("mongoose");



const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, enum: ['premium', 'usuario'], default: 'usuario' }
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel