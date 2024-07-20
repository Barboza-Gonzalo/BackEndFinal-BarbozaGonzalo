const express = require("express")
const router = express.Router()
const  productsControllers = require  ("../controllers/productsControllers.js")



router.get('/:pid', productsControllers.getProductsById) 
router.post('/', productsControllers.createProduct);
router.put('/:pid', productsControllers.updateProduct)
router.delete('/:pid', productsControllers.deleteProduct)
router.get('/', productsControllers.getProducts);



module.exports = router