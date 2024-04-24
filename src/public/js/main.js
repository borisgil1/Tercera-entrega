//Cliente

const socket = io();

//Escuchamos el evento para renderizar los productos
socket.on("products", (products) => {
    const listaProducto = document.getElementById("lista-productos");
    listaProducto.innerHTML = "";
    products.forEach(product => {
          // Crear el elemento de la tarjeta
          const card = document.createElement("div");
          card.classList.add("col-xl-4", "col-md-4", "col-sm-6", "mb-4");
  
          // Agregar contenido a la tarjeta
          card.innerHTML = `
              <div class="card text-center h-100">
                  <div class="card-header bg-primary text-white">
                      <h5 class="card-title">${product.title}</h5>
                  </div>
                  <div class="card-body">
                      <img src="${product.img}" class="card-img-top" alt="${product.title}">
                      <p class="card-text">${product.description}</p>
                      <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
                  </div>
                  <div class="card-footer">
                      <button class="btn btn-danger btn-delete" data-id="${product._id}">Eliminar</button>
                  </div>
              </div>
          `;
  
          // Agregar la tarjeta al contenedor de productos
          listaProducto.appendChild(card);

        // Agrear evento al boton 
        const buttons = document.querySelectorAll("#lista-productos button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                eliminarProducto(productId);
            });
        });
    });
});

//Eliminar producto
eliminarProducto = (id) => {
    socket.emit("deleteProduct", id);
}

//Agregar producto
document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
})

//Agg producto
addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        thumbnails: document.getElementById("thumbnails").value.split(",").map(item => item.trim())
    };
    socket.emit("addProduct", product);
};


//CHAT
//Creamos una instancia de socket.io desde el lado del cliente ahora: 


//Creamos una variable para guardar al usuario. 
let user; 
const chatBox = document.getElementById("chatBox");

//Utilizamos Sweet Alert para el mensaje de bienvenida. 

//Swal es un objeto global que nos permite usar los métodos de la librería. 
//Fire es un método que nos permite configurar el alerta. 

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})


chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //Trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})


//Listener de mensajes: 

socket.on("messagesLogs", data => {
    const log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    })
    log.innerHTML = messages;
})