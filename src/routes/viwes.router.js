const express = require("express")
const router = express.Router();
const productsModel =require ("../DAO/mongo/models/products.model.js");
const messagesModel =require ("../DAO/mongo/models/messages.model.js");
const { notAprob, aprob, userOnly } = require("../middleware/auth.js");
const {UserDTO} = require ("../DAO/DTO/user.DTO.js");
const { generateProductFaker } = require("../utils.js");
const {addLogger} = require("../public/js/logger.js");
const sessionController = require("../controllers/sessionController.js");
const viwesController = require("../controllers/viwesControllers.js");
const productController = require("../controllers/productsControllers.js")



router.post("/mail",sessionController.sendRecoveryMail);
router.get("/mail", (req,res)=>{res.render("respassword")});
router.post("/recoverypassword", sessionController.newPassword);
router.get("/loggerTest", viwesController.loggerTest)
router.get('/', viwesController.getHome);
router.get("/mockingproducts", productController.mockingProducts);
router.get("/chat",userOnly, async (req, res) => { res.render("chat")});
router.get("/login",notAprob, (req, res) => { res.render("login")});
router.get('/register', notAprob, (req, res) => { res.render('register')});




module.exports = router
