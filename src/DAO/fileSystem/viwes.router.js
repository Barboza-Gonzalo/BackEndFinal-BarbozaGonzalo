const express = require("express")
const ProductManager =require ("../DAO/fileSystem/productManager.js");
const router = express.Router();




const manager = new ProductManager();

router.get("/realtimeproducts", async (req, res) => {
  try {
    
    const products = await manager.getProducts();
    const format = req.query.format;

    if (format === 'json') {
      res.json(products);
    } else { 
      res.render("realTimeProducts", { products });
    }
  } catch (error) {
  }
});




module.exports = router
