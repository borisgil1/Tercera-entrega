const mongoose = require("mongoose");

//Conexión mongoose (base de datos)
mongoose.connect("mongodb+srv://coderhouse:coderhouse@cluster0.2zgtivj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("Conexión a la base de datos exitosa"))
    .catch((error)=>console.log("Error en la conexión a la base de datos", error))