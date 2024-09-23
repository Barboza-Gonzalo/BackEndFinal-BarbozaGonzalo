const express = require("express")
const router = express.Router()
const cartsControllers = require ("../controllers/cartsControllers.js");
const { userOnly } = require("../middleware/auth.js");

router.get('/:cid', cartsControllers.getCartById);
router.post('/', cartsControllers.createNewCart);
router.post('/:cid/product/:pid', cartsControllers.addProdToCart);
router.delete('/:cid/product/:pid', cartsControllers.deleteProductInCart);
router.post('/:cid/vproduct/:pid',cartsControllers.deleteProductInCart);
router.put('/:cid/products/:pid', cartsControllers.updateProductInCart);
router.delete('/:cid', cartsControllers.deleteCart);
router.get('/:cid/purchase',userOnly,cartsControllers.createTicket)







module.exports = router