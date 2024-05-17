const mongoose = require("mongoose") ;



const productsCollection = "Products"

const productsSchema = new mongoose.Schema({
    title: {type: String , required: true , max:150} ,
    description:{type: String , required: true , max:150} ,
    price: {type: Number , required: true },
    thumbnail: {type: String , required: true },
    code: {type: String , required: true , max:150},
    stock: {type: Number , required: true },
    status: {type: Boolean , required: true , },
    category: {type: String , required: true , max:150},
    
})



const productsModel = mongoose.model(productsCollection,productsSchema)

module.exports= productsModel