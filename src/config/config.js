//Dotenv permite setear archivos .env, datos que queremos proteger
const dotenv = require("dotenv");
//programs tiene todas las configuraciones para los argumentos quehice en el commander
const program = require("../utils/commander.js");


//configuracion mode
const { mode } = program.opts();

//configurar dotenv
dotenv.config({
    //En donde va a encontrar el archivo .env que corresponde segun el modo que pasamos por argumento
    //De acuerdo a como tengamos el modo tomo produccion o desarrollo
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

//Config object y mandamos los datos
const configObject = {
    //Mandamos el puerto que viene de process.env.PUERTO
    port: process.env.PUERTO,
    //Mandamos el mongo url que viene de process.env.Mongo_URÑ
    mongo_url: process.env.MONGO_URL
}

module.exports = configObject;


