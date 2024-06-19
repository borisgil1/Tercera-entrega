const socket = io();
let user;
const chatBox = document.getElementById("chatBox");

// SweetAlert para solicitar nombre de usuario
Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
});


// Evento para enviar mensajes en el chat
//Al presionar enter se envia el evento
chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
}) 

// Escuchar mensajes del chat
//Carga los mensajes en el chat
socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = "";
    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    })
    log.innerHTML = messages;
})

