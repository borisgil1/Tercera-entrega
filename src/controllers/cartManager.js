const CartsModel = require("../models/carts.model");

class CartManager {
 
    async addCart(newCartData) {
        try {
            const newCart = await CartsModel.create(newCartData);
            console.log("Carrito creado exitosamente");
            return newCart;
        } catch (error) {
            console.error("Error al crear nuevo carrito:", error);
        }
    }

    async getCarts() {
        try {
            const carts = await CartsModel.find();
            console.log("Carritos encontrados:", carts);
            return carts;
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartsModel.findById(id);
            if (!cart) {
                console.log(`Carrito con ID "${id}" no encontrado`);
                return null;
            } else {
                console.log("Carrito encontrado:", cart);
                return cart;
            }
        } catch (error) {
            console.error("Error al encontrar carrito por ID:", error);
        }
    }

    async updateCart(id, updatedFields) {
        try {
            const updatedCart = await CartsModel.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedCart) {
                console.log("Carrito no encontrado");
                return null;
            }
            console.log("Carrito actualizado correctamente:", updatedCart);
            return updatedCart;
        } catch (error) {
            console.error("Error al actualizar carrito:", error);
        }
    }

    async deleteCart(id) {
        try {
            const deletedCart = await CartsModel.findByIdAndDelete(id);
            if (!deletedCart) {
                console.log("Carrito no encontrado");
                return null;
            }
            console.log("Carrito eliminado correctamente:", deletedCart);
            return deletedCart;
        } catch (error) {
            console.error("Error al eliminar carrito:", error);
        }
    }
}

module.exports = CartManager;