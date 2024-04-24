const mongoose = require("mongoose");

//Schema
const productSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const MessagesModel = mongoose.model("messages", productSchema)

module.exports = MessagesModel;