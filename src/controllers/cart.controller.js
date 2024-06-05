//Controller: Operaciones del negocio. El controlador se conecta con el service. Gestiona las peticiones del cliente y las respuestas, toma parametros, datos del body...

const {cartService} = require("../service/index.js")

class cartController {

    //Crear carrito
    async createCart(req, res) {
        try {
            const newCart = {
                products: []
            };
            await cartService.addCart(newCart);
            return res.status(201).send({ message: "Carrito nuevo agregado", newCart });
        } catch (error) {
            console.error("Error al crear nuevo carrito", error);
            return res.status(500).send("Error al crear nuevo carrito");
        }
    };

    //Mostrar carrito por ID
    async getCartById(req, res) {
        let cid = req.params.cid;
        try {
            const cart = await cartService.getCartById(cid);
            if (cart) {
                return res.send(cart);
            } else {
                return res.status(404).send("Carrito no encontrado")
            }
        } catch (error) {
            console.error("Error al mostrar carrito", error);
            return res.status(500).send("Error al mostrar carrito");
        }
    };

    //Mostrar todos los carritos
    async getCarts(req, res) {
        try {
            const carts = await cartService.getCarts();
            return res.status(200).send(carts);
        } catch (error) {
            console.error("Error al mostrar carritos:", error);
            return res.status(500).send("Error al mostrar carritos")
        }
    };

    //Agregar productos a carrito
    async addProductToCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        try {
            const cartUpdated = await cartService.addProductToCart(cid, pid, quantity)
            return res.status(200).send({ message: "Producto agregado al carrito con éxito", cart: cartUpdated });
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return res.status(500).send("Error al agregar producto al carrito:");
        }
    };


    //Eliminar producto de carrito
    async deleteCartProduct(req, res) {
        let cid = req.params.cid;
        let pid = req.params.pid;
        try {
            const foundCart = await cartService.getCartById(cid)
            if (!foundCart || !pid) {
                return res.status(404).send({ message: "Carrito o producto no encontrado" });
            }
            const productIndex = foundCart.products.findIndex(product => product.product.equals(pid));
            foundCart.products.splice(productIndex, 1);
            await foundCart.save();
            console.log("Producto eliminado:", foundCart);
            return res.status(200).send({ message: "Producto eliminado del carrito con éxito", updatedCart: foundCart });
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return res.status(500).send("Error al eliminar el producto");
        }
    }

    //Actualizar productos del carrito
    async updateCartProducts(req, res) {
        const cid = req.params.id;
        console.log(cid)
        const { product, quantity } = req.body;
        console.log("Productos recibidos:", product);
        console.log("Cantidad recibida:", quantity);
        try {
            const cartUpdated = await cartService.updateCart(cid, { product, quantity });
            if (!cartUpdated) {
                return res.status(404).send({ message: "Carrito no encontrado" });
            }
            //console.log("Carrito modificado:", cartUpdated);
            return res.status(200).send({ message: "Carrito modificado", cart: cartUpdated });
        } catch (error) {
            //console.error("Error al modificar el carrito:", error);
            return res.status(500).send("Error al modificar el carrito");
        }
    }

    //Actualizar cantidad de productos del carrito
    async updateQuantity(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        try {
            const cartUpdated = await cartService.updateQuantity(cid, pid, quantity);
            return res.status(200).send({ message: "Cantidad del producto modifiactualizada", cart: cartUpdated });
        } catch (error) {
            return res.status(500).send("Error al modificar el carrito");
        }
    }

    //Vaciar carrito
    async emptyCart(req, res) {
        const id = req.params.cid;
        try {
            const updatedCart = await cartService.emptyCart(id);
            if (!updatedCart) {
                return res.status(404).send({ message: "Carrito no encontrado" });
            }
            return res.status(200).send({ message: "Todos los productos del carrito han sido eliminados", cart: updatedCart });
        } catch (error) {
            return res.status(500).send("Error al vaciar el carrito");
        }
    };
}

module.exports = cartController;