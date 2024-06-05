// Commander: librería que me permite configurar mis propios argumentos de consola
const { Command } = require('commander');

// Instancia de Command que se va a llamar program y con esto programo mis argumentos
const program = new Command();

//1- Comando // 2 - La descripción // 3 - Un valor por default
program
    .option("-p <port>", "puerto en donde se inicia el servidor", 8080)
    .option("--mode <mode>", "modo de trabajo", "produccion")
program.parse();
//Finalizamos acá la configuración.


module.exports = program;