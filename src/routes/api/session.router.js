const express = require("express")
const router = express.Router()
const sessionController = require("../../controllers/sessionController.js");
const passport = require("passport");


router.post('/register',passport.authenticate("register",{failureRedirect:"failregister"}) , sessionController.registerUser);
router.post('/login',passport.authenticate('login', { failureRedirect: 'faillogin' }), sessionController.loginUser); 
router.post('/logout', sessionController.logoutUser); 
router.get('/failregister', sessionController.failRegister)
router.get('/faillogin', sessionController.failLogin)

router.get("/github",passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})

router.get("/githubcallback", passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user =req.user;
    res.redirect("/products")

})


module.exports = router