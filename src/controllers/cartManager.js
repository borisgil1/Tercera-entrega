const fs = require("fs");

class CartManager {
    static lastId = 0;
    constructor() {
        this.path = "./cartManager.json";
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
        await this.loadCartsFromFile()
        console.log(this.carts);
        return this.carts;
    }

    async getCartsById(id) {
        await this.loadCartsFromFile();
        const product = this.carts.find(item => item.id === id);
        if (!product) {
            console.log(`Producto con ID "${id}" no encontrado`);
            return null;
        } else {
            console.log("Producto encontrado", product);
            return product;
        }
    }

    updateProduct = async (id, updatedFields) => {
        await this.loadCartsFromFile()
        const index = this.carts.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            console.log("Producto no encontrado");
            return;
        }
        this.carts[index] = { ...this.carts[index], ...updatedFields };
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        console.log("Producto actualizado correctamente");
        return this.procartsducts[index];
    }

    deleteProduct = async (id) => {
        id = parseInt(id);
        await this.loadCartsFromFile()
        const index = this.carts.findIndex(item => item.id === id);
        if (index === -1) {
            console.log("Producto no encontrado");
            return;
        }
        this.products.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        console.log("Producto eliminado correctamente");
    }

}

module.exports = CartManager;


//Testing