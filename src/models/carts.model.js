//Modelo, conexion con la bdd

const mongoose = require("mongoose");

//Schema
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                require: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
  });


const CartsModel = mongoose.model("carts", cartSchema)

module.exports = CartsModel;