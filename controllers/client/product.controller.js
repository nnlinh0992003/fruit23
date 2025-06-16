const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc"});

  const newProducts = products.map(item => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) / 100
    ).toFixed(0);
    return item;
  });


  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts
  });
};

// [GET]/products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);

    console.log(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect("/products");
  }
};
// [GET]/products/:slugCategory
module.exports.category = async (req, res) => {
  console.log(req.params.slugCategory);


  const category = await ProductCategory.findOne({
    slug:req.params.slugCategory,
    status: "active",
    deleted: false
  });


  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });
  
    let allSub = [...subs];
  
    for (const sub of subs) {
      const childs = await getSubCategory(sub.id); // đệ quy: tìm danh mục con của danh mục con
      allSub = allSub.concat(childs);
    }
  
    return allSub;
  };

  const listSubCategory= await getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id);
  console.log(listSubCategoryId);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false
  }).sort({position:"desc"});
  const newProducts = products.map(item => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) / 100
    ).toFixed(0);
    return item;
  });
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts
  });
};
