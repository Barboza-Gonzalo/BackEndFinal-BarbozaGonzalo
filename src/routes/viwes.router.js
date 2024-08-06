const express = require("express")
const router = express.Router();
const productsModel =require ("../DAO/mongo/models/products.model.js");
const messagesModel =require ("../DAO/mongo/models/messages.model.js");
const { notAprob, aprob, userOnly } = require("../middleware/auth.js");
const {UserDTO} = require ("../DAO/DTO/user.DTO.js");
const { generateProductFaker } = require("../utils.js");




router.get('/', (req, res) => {
  if (req.session.user) {
      res.redirect('/products');
  } else {
      res.redirect('/login');
  }
});


router.get("/chat",userOnly, async (req, res) => {
  res.render("chat");
});



router.get("/login",notAprob, (req, res) => {
  res.render("login");
});

router.get('/register', notAprob, (req, res) => {
  res.render('register');
});

router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    const user = new UserDTO(req.user);
    console.log(user)
    res.render("profile", { user });
} else {
    res.redirect("/login")
  }
}); 


router.get("/mockingproducts", async (req,res)=>{
  let products =[]

  for(let  i=0;i<100;i++){
    productsModel.create(generateProductFaker())
  }
  res.send({status:"success" , payload:products})
})
module.exports = router
