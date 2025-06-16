const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
// const storageMulter = require("../../helpers/storageMulter");

cloudinary.config({ 
    cloud_name: 'ddkiaep9u', 
    api_key: '379395787439693', 
    api_secret: 'SYubYwRxBW-nMODY-aLp0byeqN0' // Click 'View API Keys' above to copy your API secret
});

const upload = multer();

const controller = require("../../controllers/admin/product.controller");


router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
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
    controller.editPatch
);
router.get("/detail/:id", controller.detail);



module.exports = router;
