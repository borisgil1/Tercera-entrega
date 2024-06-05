//Service: Conexión entre controlador y persistencia. Recive el repositorio, crear instancia como services y se lo manda al controlador. Instancia del repositorio

const CartRepository = require("../repository/cart.repository.js");
const ProductRepository = require("../repository/product.repository.js");


const cartService = new CartRepository();
const productService = new ProductRepository();

module.exports = { cartService, productService };