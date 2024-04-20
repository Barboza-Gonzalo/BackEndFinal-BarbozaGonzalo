const express = require("express")
const router = express.Router()
const CartManager = require('../cartManager.js')
const ProductManager = require('../productManager.js')


const manager = new CartManager()
const managerP = new ProductManager()


router.post('/carts', async (req,res)=>{
    try{
        const newCart = req.body
        await manager.addCart(newCart)
        res.send("Carrito creado exitosamente")


    }catch(error){
        res.send("Error al crear nuevo carrito de compras")
    }
})



router.get('/carts/:cid', async (req,res)=>{
    try{
        const cartId = parseInt(req.params.cid);
        const cart = await manager.getCartById(cartId);
        res.json(cart)

    }catch(error){
        res.send("ID carrito inexistente")

    }
})
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const cart = await manager.getCartById(cartId);
        const product = await managerP.getProductById(productId);
        const productIdInCart = cart.products.findIndex(item => item.product === productId);


        if (productIdInCart !== -1) {
            cart.products[productIdInCart].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await manager.updateCart(cartId, { products: cart.products });        
        res.send("Producto agregado al carrito correctamente");
    } catch (error) {
        res.send("ERROR ,no se agrega producto")
    }
})











module.exports = router