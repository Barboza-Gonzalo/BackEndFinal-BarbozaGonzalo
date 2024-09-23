const express = require("express")
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require ("fs")
const { notAprob, aprob, userOnly } = require("../middleware/auth.js");
const {UserDTO} = require ("../DAO/DTO/user.DTO.js");
const sessionController = require("../controllers/sessionController.js");
const userModel = require("../DAO/mongo/models/users.model.js");
const nodemailer = require("nodemailer");
const { transport } = require("winston");
const config  = require("../config/config.js");


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        let folder = "documents";
        if(file.fieldname === "profile"){
            folder = "profiles"
        }else if(file.fieldname === "product"){
            folder = "products" ;
        }
        const uploadPath = path.join(__dirname, `../public/archivos`);

        cb(null,uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }

})

const upload = multer ({storage})


async function delIncativeUsers(req,res) {
    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: config.user ,
            pass: config.pass
        }
    })

    const limitDays = new Date(Date.now()- 30*60*1000)
    const inactiveUsers = await userModel.find({ last_connection: { $lt: limitDays } });
    
    for(const user of inactiveUsers){
    await userModel.findByIdAndDelete(user._id);
    await transport.sendMail({
        from: "gonzaloagutinbarboza@gmail.com",
        to: user.email,
        subject : "Eliminacion de Usuario por inactividad",
        html:`
        <div>
        <h1 >
        Se elimino su usuario por mas de 2 dias sin conexion 
        </h1>         
        </div>`
    })}
    res.send({
        status: 'success',
        message: `Se eliminaron ${inactiveUsers.length} usuarios inactivos.`,
        data: inactiveUsers.map(user => ({ email: user.email }))
    });
    
}

async function deleteUser (req,res){
    const {uid} = req.params
    try{
        await userModel.findByIdAndDelete(uid);
        res.redirect("/api/users")
        
    }catch(error){
        res.status(500).send("Error al eliminar el usuario");
    }
}


async function promoveUser(req,res) {
    const {uid} = req.params;
    try {
        const user = await userModel.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', message: 'User not found' });
        }
        if (user.documents.length < 3) {
            return res.status(400).send({
                status: 'error',
                message: 'El usuario debe cargar al menos 3 documentos para ser promovido a premium.'
            });
        }
        user.role ="premium";
        await user.save();

        res.send({
            status: 'success',
            message: 'Usuario promovido a premium con éxito.'
        });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al actualizar el usuario', error });
    }
    
}


async function uploadDocuments(req,res) {
    
        try {
            const { uid } = req.params;
            const user = await userModel.findById(uid);
            if (!user) {
                return res.status(404).send({ status: 'error', message: 'User not found' });
            }
    
            const files = req.files;            
            if (files['documents']) {                
                files['documents'].forEach(file => {
                    user.documents.push({ name: file.originalname, reference: file.path });
                });
            }
            await user.save();
            res.send({ status: 'success', message: 'Documents uploaded successfully', documents: user.documents });
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error uploading documents', error });
        }
    


}


async function getAllUsers(req,res) {
    
        try{
            const users = await userModel.find()
            const userList = users.map(user => new UserDTO(user));   
            res.render("users",{userList})
        
        }catch(error){
            res.status(500).send({
                status: 'error',
                message: 'Error al obtener los usuarios',
                error: error.message
            })
            
        
        }
        
        }


async function modRole(req,res) {
    try {
        const { uid } = req.params;
        const { role } = req.body;
        await userModel.findByIdAndUpdate(uid, { role });
        res.redirect('/admin/users'); 
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al actualizar rol', error });
    }
}
    

async function getLogUser(req,res) {
    if (req.isAuthenticated()) {
        const user = new UserDTO(req.user);
        res.render("profile", { user });
    } else {
        res.redirect("/login")
    }    
}

module.exports = {
    getLogUser,
    modRole,
    deleteUser,
    promoveUser,
    uploadDocuments,
    getAllUsers,
    delIncativeUsers
}