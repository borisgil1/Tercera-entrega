const express = require("express");
const path = require("path");
const PUERTO = 8080;
const app = express();
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const fs = require("fs");
const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager();

//Handlebar
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})

//instancia Socket del servidor
const io = socket(httpServer);


//Conección cliente
io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");
    socket.on("mensaje", (data) => {
    })

//Enviar mensaje para renderizar productos
    socket.emit("products", await productManager.getProducts());

//Recibir evento eliminar producto
socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    //Actualizamos array
    socket.emit("products", await productManager.getProducts());
})    

});


