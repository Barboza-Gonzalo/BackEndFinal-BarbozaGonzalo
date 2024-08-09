const express = require("express")
const router = express.Router();
const productsModel =require ("../DAO/mongo/models/products.model.js");
const messagesModel =require ("../DAO/mongo/models/messages.model.js");
const { notAprob, aprob, userOnly } = require("../middleware/auth.js");
const {UserDTO} = require ("../DAO/DTO/user.DTO.js");
const { generateProductFaker } = require("../utils.js");
const {addLogger} = require("../public/js/logger.js")
const sessionController = require("../controllers/sessionController.js")



router.post("/mail",sessionController.sendRecoveryMail)
router.get("/mail", (req,res)=>{res.render("respassword")})
router.post("/recoverypassword", sessionController.newPassword)






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

router.get("/loggerTest", async(req,res,)=>{
  
  req.logger.info("Prueba de Logs Info"),
  req.logger.debug("Prueba de Logs Debug")
  req.logger.warning("Prueba de Logs Warn"),
  req.logger.error("Prueba de Logs Error"),
  req.logger.fatal("Prueba logs de Fatal Err")

  res.send('Logs probados, verifica la consola y el archivo de logs.');

})
router.get("/mockingproducts", async (req,res)=>{
  let products =[]

  for(let  i=0;i<100;i++){
    productsModel.create(generateProductFaker())
  }
  res.send({status:"success" , payload:products})
})



module.exports = router
