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

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            cart.products=updatedProducts;
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar carrito:", error);
            throw error; 
        }
    }

    async deleteCart(id) {
        try {
            const cadeletedCartrt = await CartsModel.findByIdAndDelete(id);
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

    async clearCart(cartId) {
        try {
            const emptyCart = await CartsModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
            if (!emptyCart) {
                console.log("Carrito no encontrado");
            }
            console.log("Carrito vaciado correctamente");
            return emptyCart;
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            throw error; 
        }
    }

    async updateQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                console.log("Carrito no encontrado");
            }
            const productIndex = cart.products.findIndex(product=>product.product._id.toString()===productId);
            if(productIndex !==-1) {
                cart.products[productIndex].quantity=quantity;
                await cart.save();
                return cart;
            } else {
                console.log("Producto no encontrado en el carrito")
            }
        } catch (error) {
            console.error("Error al modificar cantidades:", error);
            throw error; 
        }
    }

}




module.exports = CartManager;