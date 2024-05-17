const express = require("express")
const router = express.Router();
const productsModel =require ("../DAO/models/products.model.js");
const messagesModel =require ("../DAO/models/messages.model.js")






router.get("/", async (req, res) => {
  try {
    
    const products = await productsModel.find();
    const format = req.query.format;

    if (format === 'json') {
      res.json(products);
    } else { 
      res.render("realTimeProducts", ({ products }));
    }
  } catch (error) {
  }
});



router.get("/chat", async (req, res) => {
  res.render("chat");
});

/* router.post("/chat", async (req,res)=>{
  try{   const {user , message} =
  result = await messagesModel.create ({user , message})

  res.send({ result: "success", payload: result });
}catch{

}
}) */

module.exports = router
