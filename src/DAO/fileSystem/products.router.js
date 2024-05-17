const express = require("express")
const router = express.Router()
const ProductManager = require('./productManager.js')


const manager = new ProductManager()

router.get('/products',async (req ,res)=>{
    try{
        let products = await manager.getProducts()
        let limit = parseInt(req.query.limit)
        let limitedProducts = [...products]
        if( limit > 0){
            limitedProducts=limitedProducts.slice(0,limit)
            res.json(limitedProducts)
        }else{
            res.json(products)
        }
}catch(error){

}
    
})


router.get('/products/:pid',async (req ,res)=>{
    try{
        const productId = parseInt(req.params.pid);
        const product = await manager.getProductById(productId);
        res.json(product)

    }catch(error){
        res.send("ID inexistente")

    }
    
})


router.post('/products', async (req , res)=>{
    try{
        const newProduct = req.body
        await manager.addProduct(newProduct)
        res.send("Producto agregado exitosamente")

    }catch(error){
        res.send("Debe ingresar todos lo campos")

    }
})



router.put('/products/:pid', async (req , res)=>{
    try{
        const productId = parseInt(req.params.pid)
        await manager.getProductById(productId)        
        const updatedProduct = req.body
        await manager.updateProduct(productId , updatedProduct)
        res.send("Se modifico correctamente el articulo")
    }catch(error){
        res.send("ID producto inexistente")
    }
})


router.delete('/products/:pid', async (req,res)=>{
    try{
        const productId = parseInt(req.params.pid)
        await manager.getProductById(productId)
        await manager.deleteProduct(productId)
        res.send("Producto eliminado")
    }catch(error){
        res.send("producto inexistente")
    }
})






module.exports = router