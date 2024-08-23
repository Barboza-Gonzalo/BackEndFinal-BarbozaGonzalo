const  mongoose  = require("mongoose");
const config = require ("../src/config/config.js");
const Product = require ("../src/DAO/mongo/models/products.model.js")
const assert = require ("assert")

mongoose.connect(config.mongo);


describe("testing Products DAO get method",()=>{
    before(function(){
        this.productDao = new Product()
    })

it("el DAO debe retornar productos desde la DB", async function(){
    this.timeout(5000)
    try{
        const result = await Product.find()
        assert.strictEqual(Array.isArray(result) && result.length > 0 , true)
    }catch(error){
        console.error("error durante el test",error)
        assert.fail("test fallido")
    }
})


it("el DAO debe agregar producto a la DB" , async function(){
    this.timeout(5000)
    let mockproduct = {
        title: "TestP",
        description: "TestP",
        price: 99999,
        thumbnail: "https://ardiaprod.vtexassets.com/arquivos/ids/294330-1200-auto?v=638458628813870000&width=1200&height=auto&aspect=true",
        code: "99999",
        stock: 99999,
        status: true,
        category: "TestP"
    }

    const result = await Product.create(mockproduct);
    assert.ok(result._id);
    createdProductId = result._id;

})


it("el DAO debe eliminar producto de la DB", async function(){
    this.timeout(5000)
    const deleteResult = await Product.deleteOne({ _id: createdProductId });
    assert.strictEqual(deleteResult.deletedCount, 1);
    
})

})