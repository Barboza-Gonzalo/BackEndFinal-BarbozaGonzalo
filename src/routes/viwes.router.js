const express = require("express")
const router = express.Router();
const productsModel =require ("../DAO/models/products.model.js");
const messagesModel =require ("../DAO/models/messages.model.js");
const { notAprob, aprob } = require("../middleware/auth.js");






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

router.get("/login", notAprob, (req, res) => {
  res.render("login");
});

router.get('/register', notAprob, (req, res) => {
  res.render('register');
});


module.exports = router
