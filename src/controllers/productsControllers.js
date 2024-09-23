const productsModel = require ("../DAO/mongo/models/products.model.js");
const { CustomError } = require("../services/CustomError.js");
const  {EErrors}  = require("../services/errorEnum.js");
const { generateProductErrorInfo } = require("../services/info.js");
const nodemailer = require("nodemailer");
const { transport } = require("winston");
const config  = require("../config/config.js");




async function   getProducts(req, res) {
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
            nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${sort || ''}&query=${query || ''}` : null,
            
        };
        const user = req.session.user
    
        
        

        res.render("products" ,{ response , user });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

async function getProductsById (req,res){
    try{
        const {pid} = req.params;
        
        const result = await productsModel.findById({_id:pid});
        const user = req.session.user
        res.render("product", { result ,user});

    }catch(error){
        
        res.send("ID inexistente")

    }
}






async function createProduct(req, res, next) {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        if (!title || !description || !price || !thumbnail || !code || !stock || status === undefined || !category) {
            throw CustomError.createError({
                name: "Creación de producto",
                cause: generateProductErrorInfo({ title, description, price, thumbnail, code, stock, status, category }),
                message: "Error al intentar crear producto",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        const result = await productsModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
            owner: req.user._id
        });

        res.redirect("/products");
    } catch (error) {
        next(error)
    }
}

async function updateProduct (req,res){
    try{
        
        const {pid} = req.params
        const productToReplace = req.body
        const result = await productsModel.updateOne({_id:pid},productToReplace)
        res.send({ result: "success", payload: result })
    }catch(error){
        res.send("ID producto inexistente")
    }

}


async function deleteProduct (req,res){
    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: config.user ,
            pass: config.pass
        }
    })
    try{
        let {pid} = req.params
        let product = await productsModel.findById({ _id:pid }).populate("owner");
        const owner = product.owner;
        if (owner && owner.role === "premium"){
            await transport.sendMail({
                from: "gonzaloagutinbarboza@gmail.com",
                to: owner.email,
                subject : "Eliminacion de Producto ",
                html:`
                <div>
                <h1 >
                Tu producto    <h2>${product.title}</h2>   ha sido eliminado del sistema.
                </h1>         
                </div>`
            })}
            await productsModel.deleteOne({ _id: pid });
        
        res.redirect("/products")
        
    }catch(error){
        res.send("producto inexistente")
    }
}


async function mockingProducts(req,res) {
    let products =[]
    for(let  i=0;i<100;i++){
    productsModel.create(generateProductFaker())
    }
    res.send({status:"success" , payload:products})
}
    




module.exports = {
    mockingProducts,
    getProducts ,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct
}