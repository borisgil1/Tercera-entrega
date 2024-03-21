const fs = require("fs");

class ProductManager {
    static lastId = 0;
    constructor() {
        this.path = "./src/models/productManager.json";
        this.loadProductsFromFile();
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                ProductManager.lastId = Math.max(...this.products.map(product => product.id));
            }
        } catch (error) {
            console.error("Error loading products from file:", error);
            this.products = [];
        }
    }

    async addProduct(title, description, price, img, code, stock, category, status=true) {
        try {
        if (!title || !description || !price || !img || !code || !stock || !category) {
            console.log("Favor llenar todos los campos");
            return;
        }
        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }
        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status,
        };
        this.products.push(newProduct);
        await this.saveProductsToFile();
        console.log("Producto agregado exitosamente");
        return newProduct;          
        } catch (error) {
            console.error("Error al agrergar un nuevo producto", error);
        }
    }

    async saveProductsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error guardando productos al archivo", error);
        }
    }

    async getProducts(){
        await this.loadProductsFromFile()
        console.log(this.products); 
        return this.products; 
    }

    async getProductById(id) {
        await this.loadProductsFromFile();
        const product = this.products.find(item => item.id === id);
        if (!product) {
            console.log(`Producto con ID "${id}" no encontrado`);
            return null;
        } else {
            console.log("Producto encontrado", product);
            return product;
        }
    }

    updateProduct = async (id, updatedFields) => {
        await this.loadProductsFromFile()
        const index = this.products.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            console.log("Producto no encontrado");
            return;
        }
        this.products[index] = { ...this.products[index], ...updatedFields };
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        console.log("Producto actualizado correctamente");
        return this.products[index];
    }

    deleteProduct = async (id) => {
        id = parseInt(id);
        await this.loadProductsFromFile()
        const index = this.products.findIndex(item => item.id === id);
        if (index === -1) {
            console.log("Producto no encontrado");
            return null;
        }
        this.products.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        console.log("Producto eliminado correctamente");
        return this.deleteProduct;
    }
}

module.exports = ProductManager;
//Testing

//Instancia de la clase “ProductManager”
const testing = new ProductManager("./productManager.json");

//getProducts - Devuelve arreglo vacío
//testing.getProducts();

//add product - Se agrega producto 

//testing.addProduct("Play Station 1", "Consola de videojuegos", 1000, "Sin imagen", "abc123", 3, "consola");
// testing.addProduct("Play Station 2", "Consola de videojuegos", 1500, "Sin imagen", "abc124", 15);
// testing.addProduct("Play Station 3", "Consola de videojuegos", 2000, "Sin imagen", "abc125", 19);
// testing.addProduct("Play Station 4", "Consola de videojuegos", 2500, "Sin imagen", "abc126", 43);
// testing.addProduct("Play Station 5", "Consola de videojuegos", 3000, "Sin imagen", "abc127", 190);
// testing.addProduct("Xbox", "Consola de videojuegos", 900, "Sin imagen", "abc128", 2);
// testing.addProduct("Xbox 360", "Consola de videojuegos", 1400, "Sin imagen", "abc129", 16);
// testing.addProduct("Xbox One", "Consola de videojuegos", 1950, "Sin imagen", "abc130", 21);
// testing.addProduct("Nintengo Switch", "Consola de videojuegos", 2900, "Sin imagen", "abc131", 245);
// testing.addProduct("Play station Vita", "Consola de videojuegos", 2250, "Sin imagen", "abc132", 9);

//getProducts - Aparece producto recién agregado
//console.log(testing.getProducts());


//getProductById - Devuelve producto por ID
//console.log(testing.getProductById(1));

//updateProduct - Modifica producto
//testing.updateProduct(1, { price: 990000000 });

//deleteProduct - Elimina producto
//console.log(testing.deleteProduct(1));