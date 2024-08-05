const cartsModel = require("../DAO/mongo/models/carts.model.js")
const productsModel = require("../DAO/mongo/models/products.model.js")
const ticketModel = require("../DAO/mongo/models/ticket.model.js");
const { addProductCartError } = require("../services/info.js");
const  {EErrors}  = require("../services/errorEnum.js");
const { CustomError } = require("../services/CustomError.js");


async function getCartById (req,res) {
    try{
        let {cid} = req.params
        const cart = await cartsModel.findById(cid).populate('products.productId')
        console.log(cart)
        res.render("carts", {cart} )
    

    }catch(error){
        res.send("ID carrito inexistente")

    }
}


async function createNewCart (req,res) {
    try{        
        const newCart = new cartsModel({
            products: [] 
        });    
        const savedCart = await newCart.save();
        res.send({ result: "success", payload: savedCart });

    }catch(error){
        res.send("Error al crear nuevo carrito de compras")
    }

}


async function addProdToCart(req, res, next) {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsModel.findById(cid);
        const product = await productsModel.findById(pid);
        
        

        if (!cart || !product) {
            throw CustomError.createError({
                name: "Agregar producto a carrito",
                cause: addProductCartError({cid, pid}),
                message: "Error al intentar agregar producto al carrito: carrito o producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }

        const productIndex = cart.products.findIndex(item => item.productId.equals(pid));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ productId: pid, quantity: 1 });
        }

        await cart.save();

        res.send({ result: "success", message: "Producto agregado al carrito correctamente", payload: cart });
    } catch (error) {
        next(error);
    }
}



async function deleteProductInCart(req,res,next){
    try {
        const {cid , pid} = req.params
        const cart = await cartsModel.findById({ _id:cid})
        if (!cart) {
            throw CustomError.createError({
                name: "Carrito no encontrado para eliminar",
                cause: addProductCartError({cid, pid}),
                message: "Error al intentar eliminar producto al carrito: carrito o producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }
        const productIndex = cart.products.findIndex(item => item.productId.equals(pid));
        if (productIndex === -1) {
            throw CustomError.createError({
                name: "Producto no encontrado en carrito",
                cause: addProductCartError({cid, pid}),
                message: "Error al intentar eliminar producto al carrito: carrito o producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        
        }        
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.send({ result: "success", message: "Producto eliminado del carrito correctamente", payload: cart });
    } catch (error) {
        next(error)
    }
}



async function deleteCart (req,res,next){
  try{  const {cid } = req.params
    const cart = await cartsModel.findById({ _id:cid})
    if (!cart) {
        throw CustomError.createError({
            name: "Carrito no encontrado para eliminar",
            cause: addProductCartError({cid}),
            message: "Error al intentar eliminar producto al carrito: carrito o producto no encontrado",
            code: EErrors.DATABASE_ERROR
        })
        
    }
    cart.products = [];
    await cart.save();

    res.status(200).send({ result: "success", payload: cart })
}
catch(error){
    next(error)
}}



async function updateProductInCart(req,res,next){
    try{
        const {cid , pid} = req.params
        const { quantity } = req.body;
        const cart = await cartsModel.findById({ _id:cid})
        const productIndex = cart.products.findIndex(item => item.productId.equals(pid));
        if (!cart) {
            throw CustomError.createError({
                name: "Carrito no encontrado para eliminar",
                cause: addProductCartError({cid, pid}),
                message: "Error al intentar eliminar producto al carrito: carrito o producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        }
        
        if (productIndex === -1) {
            throw CustomError.createError({
                name: "Producto no encontrado en carrito",
                cause: addProductCartError({cid, pid}),
                message: "Error al intentar eliminar producto al carrito: carrito o producto no encontrado",
                code: EErrors.DATABASE_ERROR
            });
        
        } 

        cart.products[productIndex].quantity = quantity
        await cart.save();

        res.send({ result: "success", payload: cart });
    } catch (error) {
        next(error)
    }
}


async function createTicket(req, res) {
    try {
        console.log("Session User:", req.session.user)
        const userId = req.session.user; 
        const userEmail = req.session.user.email; 
        const cart = await cartsModel.findOne({ _id: req.session.user.cart }).populate("products.productId");
        
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        let totalAmount = 0;
        const productsNotProcessed = [];

        for (const item of cart.products) {
            const product = item.productId;
            const quantity = item.quantity;

            if (product.stock >= quantity) {
                product.stock -= quantity;
                await product.save(); 

                totalAmount += product.price * quantity; 
            } else {
                productsNotProcessed.push(product._id); 
            }
        }

        if (totalAmount > 0) {
            const newTicket = new ticketModel({
                code: new Date().getTime().toString(), 
                amount: totalAmount,
                purchaser: userEmail,
            });

            await newTicket.save();
        }

        
        cart.products = cart.products.filter(item => productsNotProcessed.includes(item.productId._id));
        await cart.save();

        res.json({
            status: "success",
            message: "Compra procesada",
            productsNotProcessed,
        });
    } catch (error) {
        console.error("Error processing purchase:", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
}





module.exports = {
    getCartById,
    createNewCart,
    addProdToCart,
    deleteProductInCart,
    deleteCart,
    updateProductInCart,
    createTicket
}