const { transport } = require("winston");
const userModel = require("../DAO//mongo/models/users.model.js");
const  {createHash}  = require("../utils.js");
const config  = require("../config/config.js");
const nodemailer = require("nodemailer");




async function registerUser (req,res){
    res.redirect('/login')
}


async function loginUser (req,res){
    req.logger.info("inicio login raiz");
    if (!req.user) return res.status(400).send({ status: 'error', error: "Invalid credentials" })
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        cart:req.user.cart,
        role: req.user.role
    }
    res.redirect('/products')
}


async function failRegister (req,res){
    
    res.send({ error: "Failed" })
}
async function logoutUser (req,res){
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    })
}

async function failLogin (req,res){
    req.logger.error();
    res.redirect('/login')
}

async function sendRecoveryMail (req,res){
    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: config.user ,
            pass: config.pass
        }
    })
    
    let email = req.body.email
    
    let result = await transport.sendMail({
        from: "gonzaloagutinbarboza@gmail.com",
        to: email,
        subject : "Restablecer Contraseña",
        html:`
        <div>
        <a href="http://localhost:8080/mail">
    <button>Restablecer Contraseña</button>
        </a>         
        </div>`
    })

}

async function newPassword (req,res){
    
try{
    const { email, password } = req.body;
    let user = await userModel.findOne({email:email})
    const hashedPassword = createHash(password);
    await userModel.updateOne({ email: email }, { $set: { password: hashedPassword } });
    res.redirect("/login")
    }catch(error){
        
    }
}




module.exports={
    registerUser,
    loginUser,
    logoutUser,
    failRegister,
    failLogin, 
    sendRecoveryMail,
newPassword}