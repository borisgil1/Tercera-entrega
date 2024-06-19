const mongoose = require("mongoose");

//Schema
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
});

ticketSchema.pre('save', async function(next) {
    const doc = this;
    try {
        if (!doc.code) {
            // Generar código único basado en la fecha actual y un número aleatorio
            const today = new Date();
            const year = today.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año
            const month = ('0' + (today.getMonth() + 1)).slice(-2); // Asegurarse de tener dos dígitos para el mes
            const day = ('0' + today.getDate()).slice(-2); // Asegurarse de tener dos dígitos para el día
            const randomNum = Math.floor(1000 + Math.random() * 9000); // Número aleatorio de 4 dígitos
            doc.code = `${year}${month}${day}-${randomNum}`; // Formato del código: YYMMDD-NNNN
        }
        next();
    } catch (error) {
        next(error);
    }
});

const TicketModel = mongoose.model("tickets", ticketSchema);

module.exports = TicketModel;