const express = require("express")
const router = express.Router()
const  productsControllers = require  ("../controllers/productsControllers.js");
const { adminOnly } = require("../middleware/auth.js");



router.get('/:pid', productsControllers.getProductsById) 
router.post('/',adminOnly, productsControllers.createProduct);
router.put('/:pid',adminOnly, productsControllers.updateProduct)
router.delete('/:pid',adminOnly, productsControllers.deleteProduct)
router.get('/', productsControllers.getProducts);



module.exports = router