//Controller: Operaciones del negocio. El controlador se conecta con el service. Gestiona las peticiones del cliente y las respuestas, toma parametros, datos del body...

const TicketModel = require("../models/ticket.js");
const { cartService } = require("../service/index.js")
const { productService } = require("../service/index.js");

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
                return res.status(200).json({ message: "Carrito encontrado", cart }); // Enviar carrito junto con mensaje
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
        const quantity = req.body.quantity || 1;
        try {
            const cartUpdated = await cartService.addProductToCart(cid, pid, quantity)
            //return res.status(200).send({ message: "Producto agregado al carrito con éxito", cart: cartUpdated });
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


    // Finalizar compra
    async purchase(req, res) {
        const cid = req.params.cid;
        const { amount, email } = req.body;

        // Arreglo de productos con stock
        const productsInStock = [];

        // Arreglo de productos sin stock
        const outOfStockProducts = [];

        try {
            // Obtemenos el carrito y validamos su existencia
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(404).send({ message: "Carrito no encontrado, no se puede continuar con la compra" });
            }

            //Validamos si hay prodcutos en el carrito
            if (cart.products.length === 0) {
                return res.status(400).send({ message: "El carrito está vacío" });
            }

            // Verificamos el stock de los productos en el carrito y clasificarlos
            for (const item of cart.products) {
                const pid = item.product._id; // Capturo el id de cada producto en el carito
                const quantity = item.quantity; // Capturo cantidad de los productos en el carrito
                const product = await productService.getProductById(pid); // Busco el producto del carrito en la bdd para validar el stock vs la cantidad en el carrito

                if (product.stock < quantity) {
                    // Si no tienen suficiente stock los agregamos a outOfStockProducts
                    outOfStockProducts.push(item.product.name);
                } else {
                    // Si tienen stock los agregamos a productsInStock
                    outOfStockProducts.push({ name: item.product.name, requestedQuantity: quantity, availableStock: product.stock });
                }
            }

            // Si hay productos con suficiente stock, actualizamos la cantidad en la bdd
            for (const item of productsInStock) {
                const pid = item.product._id; // Capturo el id de cada producto
                const quantity = item.quantity; // Capturo cantidad de productos en el carrito
                const updatedProduct = await productService.updateProduct(pid, { $inc: { stock: -quantity } });
                if (!updatedProduct) {
                    return res.status(404).send({ message: `Producto con ID ${pid} no encontrado` });
                }
            }

              // Calculamos el total de la compra y preparamos el detalle de los productos comprados
        const purchasedProducts = [];
        let totalAmount = 0;
        
            // Calculamos el total de la compra
            if (productsInStock.length > 0) {
                //Para cada producto en productsInStock, se busca el producto en el carrito original para obtener su precio.
                const totalAmount = productsInStock.reduce((acc, item) => {
                    const product = cart.products.find(p => p.product._id === item.product._id);
                    if (!product || !product.product || !product.product.price) {
                        console.error("Producto en carrito sin precio:", product);
                        return acc;
                    }

                     // Agregar productos comprados a purchasedProducts
                purchasedProducts.push({
                    name: productInCart.product.name,
                    price: productInCart.product.price,
                    quantity: item.quantity
                });

                    return acc + (product.product.price * item.quantity);
                }, 0);

                // Creo el ticket si hay productos comprables
                const newTicket = new TicketModel({
                    code: generateRandomCode(),
                    purchase_datetime: Date.now(),
                    amount: totalAmount,
                    purchaser: email
                });

                // Guardamos el ticket
                await newTicket.save();

                // Vaciamos el carrito
                const emptyCart = await cartService.emptyCart(cid);
                if (!emptyCart) {
                    return res.status(404).send({ message: "Carrito no encontrado" });
                }

                // Enviamos respuesta con el ticket y los productos sin stock
                return res.status(200).json({
                    message: "La compra ha sido finalizada",
                    ticket: newTicket,
                    outOfStockProducts: outOfStockProducts.length > 0 ? outOfStockProducts : outOfStockProducts
                });
            } else {
                return res.status(400).json({ message: "No se pueden comprar los productos seleccionados", outOfStockProducts });
            }

        } catch (error) {
            return res.status(500).send("Error al procesar la compra: " + error);
        }

        function generateRandomCode() {
            const length = 6; // Especifica la longitud del código aleatorio
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Caracteres a usar en el código
            let code = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                code += charset[randomIndex];
            }
            return code;
        }
    }
}
module.exports = cartController;

