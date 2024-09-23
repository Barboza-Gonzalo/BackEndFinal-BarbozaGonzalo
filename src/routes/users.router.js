const express = require("express")
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require ("fs")
const { notAprob, aprob, userOnly,adminOnly } = require("../middleware/auth.js");
const {UserDTO} = require ("../DAO/DTO/user.DTO.js");
const sessionController = require("../controllers/sessionController.js");
const userModel = require("../DAO/mongo/models/users.model.js");
const usersController = require ("../controllers/usersControllers.js");

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




router.put("/premium/:uid",usersController.promoveUser);
router.post("/:uid/documents", upload.fields([{ name: 'profile', maxCount: 1 },{ name: 'product', maxCount: 1 },{ name: 'documents', maxCount: 3 }]),usersController.uploadDocuments );
router.get("/",adminOnly,usersController.getAllUsers);
router.delete("/",usersController.delIncativeUsers);
router.post("/delete/:uid",usersController.deleteUser);
router.post("role/:uid",usersController.modRole);
router.get("/current",usersController.getLogUser);  










module.exports = router