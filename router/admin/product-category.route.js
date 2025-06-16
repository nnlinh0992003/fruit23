const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const controller = require("../../controllers/admin/product-category.controller");


router.get("/", controller.index);

router.get("/create", controller.create);



const upload = multer();
router.post(
    "/create",
    upload.single("thumbnail"),
    function (req, res, next) {
        if(req.file){
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                      (error, result) => {
                        if (result) {
                          resolve(result);
                        } else {
                          reject(error);
                        }
                      });
        
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
        
            async function upload(req) {
                let result = await streamUpload(req);
                req.body[req.file.fieldname]=result.secure_url;
                next();
                
            }
    
            upload(req);

        }   else{
            next();

        }
        
        
    },
    controller.createPost
);

router.get("/edit/:id", controller.edit);


router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    function (req, res, next) {
        if(req.file){
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                      (error, result) => {
                        if (result) {
                          resolve(result);
                        } else {
                          reject(error);
                        }
                      });
        
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
        
            async function upload(req) {
                let result = await streamUpload(req);
                req.body[req.file.fieldname]=result.secure_url;
                next();
                
            }
    
            upload(req);

        }   else{
            next();

        }
        
        
    },
    controller.editPatch
);



module.exports = router;
