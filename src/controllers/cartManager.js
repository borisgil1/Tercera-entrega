const fs = require("fs");

class CartManager {
    static lastId = 0;
    constructor() {
        this.path = "./src/models/cartManager.json";
        this.loadCartsFromFile();
    }

    async loadCartsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                CartManager.lastId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error loading products from file:", error);
            //probar//
            await this.saveCartsToFile();
            this.carts = [];
        }
    }

    async addCart(newCart) {
        try {
            this.carts.push(newCart);
            await this.saveCartsToFile();
        } catch (error) {
            console.error("Error al crear nuevo carrito:", error);
        }
    }

    async saveCartsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error guardando productos al archivo", error);
        }
    }

    async getCarts() {
        try {
            await this.loadCartsFromFile()
            console.log(this.carts);
            return this.carts;
        } catch (error) {
            console.error("Error cargando los carritos del archivo", error);
        }
    }

    async getCartsById(id) {
        try {
            await this.loadCartsFromFile();
            const cart = this.carts.find(item => item.id === id);
            if (!cart) {
                console.log(`Carrito con ID "${id}" no encontrado`);
                return null;
            } else {
                console.log("Carrito encontrado", cart);
                return cart;
            }
        } catch (error) {
            console.log("Error al encontrar carrito", error);
        }
    }

    updateCart = async (id, updatedFields) => {
        await this.loadCartsFromFile()
        const index = this.carts.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            console.log("Carrito no encontrado");
            return;
        }
        this.carts[index] = { ...this.carts[index], ...updatedFields };
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        console.log("Vsrito actualizado correctamente");
        return this.procartsducts[index];
    }

    deleteCart = async (id) => {
        id = parseInt(id);
        await this.loadCartsFromFile()
        const index = this.carts.findIndex(item => item.id === id);
        if (index === -1) {
            console.log("Carrito no encontrado");
            return;
        }
        this.products.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        console.log("Carrito eliminado correctamente");
    }
}

module.exports = CartManager;