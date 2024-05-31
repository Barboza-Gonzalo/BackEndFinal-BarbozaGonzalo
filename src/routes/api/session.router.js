const express = require("express")
const router = express.Router()
const userModel = require("../../DAO/models/users.model.js");
const  {createHash}  = require("../../utils.js");
const passport = require("passport");




router.post('/register',passport.authenticate("register",{failureRedirect:"failregister"}) ,async (req, res) => {
    res.redirect('/login')
});


router.get('/failregister', async (req, res) => {
    console.log("Failed Strategy")
    res.send({ error: "Failed" })
})
 

router.post('/login',passport.authenticate('login', { failureRedirect: 'faillogin' }), async (req, res) => {
    /* const { email, password } = req.body;
    if(!email || !password) return res.status(400).send({status:"error",error:"Datos incompletos"})
    try {
        const user = await userModel.findOne({ email:email },{email:1 ,first_name:1,last_name:1,password:1});
        
        if (!user) return res.status(404).send('Usuario no encontrado');
        if(!createHash.isValidPassword(user , password)) return res.status(403).send({error:"password incorrecto"})
        delete user.password
        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
        };
        res.redirect('/products');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    } */
    if (!req.user) return res.status(400).send({ status: 'error', error: "Invalid credentials" })
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }
    res.redirect('/products')
}); 

router.get('/faillogin', (req, res) => {
    res.send({ error: "Falied login" })
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
}); 


router.get("/github",passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})

router.get("/githubcallback", passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user =req.user;
    res.redirect("/products")

})


module.exports = router