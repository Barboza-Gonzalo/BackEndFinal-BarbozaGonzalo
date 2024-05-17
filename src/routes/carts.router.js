const express = require("express")
const router = express.Router()
const cartsModel = require("../DAO/models/carts.model.js")
const productsModel = require("../DAO/models/products.model.js")

router.post('/', async (req,res)=>{
    try{        
        const newCart = new cartsModel({
            products: [] 
        });    
        const savedCart = await newCart.save();
        res.send({ result: "success", payload: savedCart });

    }catch(error){
        res.send("Error al crear nuevo carrito de compras")
    }
})



router.get('/:cid', async (req,res)=>{
    try{
        let {cid} = req.params
        let result = await cartsModel.findById({ _id:cid})
        res.send({ result: "success", payload: result })
     

    }catch(error){
        res.send("ID carrito inexistente")

    }
})
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const {cid , pid} = req.params
        const cart = await cartsModel.findById({ _id:cid})
        const product = await productsModel.findById({_id: pid}) ;
        const productIndex = cart.products.findIndex(item => item.productId.equals(pid));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ productId: pid, quantity: 1 });
        }
        await cart.save();

        res.send({ result: "success", message: "Producto agregado al carrito correctamente", payload: cart });
    } catch (error) {
        res.send("ERROR ,no se agrega producto")
    }
})











module.exports = router