// Dotenv permite cargar variables de entorno desde archivos .env
const dotenv = require("dotenv");
// program tiene todas las configuraciones para los argumentos que se configuraron en commander
const program = require("../utils/commander.js");

// Obtener la configuración de modo
const { mode } = program.opts();

// Configurar dotenv
dotenv.config({
    // Especifica la ruta del archivo .env según el modo proporcionado como argumento
    // Si el modo es 'produccion', carga .env.produccion; de lo contrario, carga .env.desarrollo
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

// Crear el objeto de configuración y enviar los datos
const configObject = {
    // Enviar el puerto que viene de process.env.PUERTO
    port: process.env.PUERTO,
    // Enviar la URL de MongoDB que viene de process.env.MONGO_URL
    mongo_url: process.env.MONGO_URL
}

module.exports = configObject;