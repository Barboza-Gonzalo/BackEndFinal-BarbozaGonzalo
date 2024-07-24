const mongoose = require("mongoose") ;


const ticketCollection = "Tickets"

const ticketSchema = new mongoose.Schema({
    code:{type: String , required: true , max:150},
    purchase_datetime:{type: Date, default: Date.now},
    amount:{type:Number,required: true,},
    purchaser: { type: String, required: true, max: 150 }
})



const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = ticketModel