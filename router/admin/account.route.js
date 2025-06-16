const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const controller = require("../../controllers/admin/account.controller");

const  validate  = require("../../validates/account.validate");
cloudinary.config({ 
    cloud_name: 'ddkiaep9u', 
    api_key: '379395787439693', 
    api_secret: 'SYubYwRxBW-nMODY-aLp0byeqN0' 
});

const upload = multer();
router.get("/", controller.index);

router.get("/create", controller.create);



router.post(
    "/create",
    upload.single("avatar"),
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
    validate.createPost,
    controller.createPost
);


module.exports = router;