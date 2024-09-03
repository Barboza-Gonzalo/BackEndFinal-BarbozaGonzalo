const express = require("express")
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require ("fs")
const { notAprob, aprob, userOnly } = require("../middleware/auth.js");
const {UserDTO} = require ("../DAO/DTO/user.DTO.js");
const sessionController = require("../controllers/sessionController.js");
const userModel = require("../DAO/mongo/models/users.model.js");


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


router.get("/premium/:uid", (req, res) => {
    if (req.isAuthenticated()) {
        const user = new UserDTO(req.user);
        console.log(user)
        res.render("profile", { user });
    }else {
        res.redirect("/login")
    }
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

router.put("/premium/:uid", async (req,res) =>{
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

})


router.post("/:uid/documents", upload.fields([
        { name: 'profile', maxCount: 1 },
        { name: 'product', maxCount: 1 },
        { name: 'documents', maxCount: 3 }
    ]), async(req,res) => {
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
});






  
module.exports = router
