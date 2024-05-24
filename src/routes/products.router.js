const express = require("express")
const router = express.Router()
const productsModel = require ("../DAO/models/products.model.js")




/* router.get('/',async (req ,res)=>{
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
    
})*/


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





router.get('/', async (req, res) => {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    try {
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { category: RegExp(query, 'i') },
                    { status: query.toLowerCase() === 'true' } // Comparar como booleano
                ]
            };
        }

        let sortOptions = {};
        if (sort) {
            sortOptions.price = sort === 'asc' ? 1 : -1;
            if(sort){
                sortOptions.price = sort === 'desc' ? -1 : 1;
            }
        }

        const totalProducts = await productsModel.countDocuments(filter);

        const totalPages = Math.ceil(totalProducts / limit);
        const offset = (page - 1) * limit;

        const products = await productsModel.find(filter)
            .sort(sortOptions)
            .skip(offset)
            .limit(limit);

        const response = {
            status: "success",
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${sort || ''}&query=${query || ''}` : null
        };
        const user = req.session.user

        res.render("products" ,{ response , user});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

 

module.exports = router