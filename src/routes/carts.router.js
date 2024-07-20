const express = require("express")
const router = express.Router()
const cartsControllers = require ("../controllers/cartsControllers.js")

router.get('/:cid', cartsControllers.getCartById);
router.post('/', cartsControllers.createNewCart);
router.post('/:cid/product/:pid', cartsControllers.addProdToCart);
router.delete('/:cid/product/:pid', cartsControllers.deleteProductInCart);
router.put('/:cid/products/:pid', cartsControllers.updateProductInCart);
router.delete('/:cid', cartsControllers.deleteCart);








module.exports = router