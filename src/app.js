//App: Inicializa el servidor

//Express
const express = require("express");
//Creamos nuestra app
const app = express();
const PUERTO = 8080;
//Rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js");
//Handlebars
const exphbs = require("express-handlebars");
const socket = require("socket.io");
//Repository
const ProductRepository = require("./repository/product.repository.js");
const productRepository = new ProductRepository();
const CartRepository = require("./repository/cart.repository.js");
const cartRepository = new CartRepository();
//Base de datos
require("./database.js");
//Chat
const MessagesModel = require("./models/messages.model.js")
//Cookies 
const session = require("express-session");
const cookieParser = require("cookie-parser");
//FileStore
const FileStore = require("session-file-store");
//const fileStore = new FileStore(session);
//MongoStore
const MongoStore = require("connect-mongo");
//Passport
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
//Config Object
const configObject = require("./config/config.js")
const { mongo_url, port} = configObject;
//Program
//const program = require ("program");


//Handlebar
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
    secret: "secretCoder", 
    resave: true, 
    saveUninitialized: true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://coderhouse:coderhouse@cluster0.2zgtivj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl:100
    })
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();


//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter)
app.use("/api/users", userRouter)


//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`);
})

//instancia Socket del servidor
const io = socket(httpServer);

//Conección cliente
io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    //Enviar mensaje para renderizar productos
    const products = await productRepository.getProducts();
    socket.emit("products", products);
    //console.log(products)

    //Recibir evento agg producto al carrito
    socket.on("addProductToCart", async (cid, pid, quantity) => {
        await cartRepository.addProductToCart(cid, pid, quantity);
        //Evniamos array actualizado
        socket.emit("addProductToCart", await cartRepository.addProductToCart(cid, pid, quantity));
    })

    //Recibir evento agg producto desde cliente con formulario
    socket.on("addProduct", async (product) => {
        await productRepository.addProduct(product.title, product.description, product.price, product.img, product.code, product.stock, product.category, product.status);
        socket.emit("products", await productRepository.getProducts());
        //io.emit("products", await productManager.getProducts());
    })
});


//const io = new socket.Server(httpServer)

//chat
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {
       await MessagesModel.create(data);

        //obtengo mensajes de mongo
        const messages = await MessagesModel.find();
        console.log(messages)
        io.emit("messagesLogs", messages);
    })
})

//////////////////////////////////////////

// console.log(process.cwd());
// console.log(process.pid);
// console.log(process.memoryUsage());
// console.log(process.version); 

