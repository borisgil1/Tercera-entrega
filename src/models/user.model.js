const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

const UserModel = mongoose.model("usuarios", userSchema)

module.exports = UserModel;