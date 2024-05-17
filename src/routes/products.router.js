const express = require("express")
const router = express.Router()
const productsModel = require ("../DAO/models/products.model.js")




router.get('/',async (req ,res)=>{
    try{
        let products = await productsModel.find()
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


router.get('/:pid',async (req ,res)=>{
    try{
        const {pid} = req.params;
        const result = await productsModel.findById({_id:pid});
        res.send({ result: "success", payload: result })

    }catch(error){
        res.send("ID inexistente")

    }
    
}) 


router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const result = await productsModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        });

        res.send({ result: "success", payload: result });

    } catch (error) {
        
    }
});

 
router.put('/:pid', async (req , res)=>{
    try{
        
        const {pid} = req.params
        const productToReplace = req.body
        const result = await productsModel.updateOne({_id:pid},productToReplace)
        res.send({ result: "success", payload: result })
    }catch(error){
        res.send("ID producto inexistente")
    }
})


router.delete('/:pid', async (req,res)=>{
    try{
        let {pid} = req.params
        let result = await productsModel.deleteOne({ _id:pid });
        res.send({ result: "success", payload: result })
        
    }catch(error){
        res.send("producto inexistente")
    }
})


 



module.exports = router

