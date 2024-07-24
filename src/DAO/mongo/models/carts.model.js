const mongoose = require("mongoose") ;



const cartsCollection = "Carts"

const cartsSchema = new mongoose.Schema({
    products:{
        type: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]}
});
    




const cartsModel = mongoose.model(cartsCollection,cartsSchema)

module.exports = cartsModel