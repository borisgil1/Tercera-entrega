const mongoose = require("mongoose");

//Schema
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                fer: "Product",
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ]
})

const CartsModel = mongoose.model("carts", cartSchema)

module.exports = CartsModel;