const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");
// [GET]
module.exports.index = async (req, res) =>{
    const productsFeatured = await Product.find({
        featured:"1",
        deleted: false,
        status: "active"
    });
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);



    const productsNew = await Product.find({
        featured:'1',
        deleted: false,
        status:"active"
    }).sort({position:"desc"});
    const newProductsNew = productsHelper.priceNewProducts(productsNew);
    res.render("client/pages/home/index",{
        pageTitle:"Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}

