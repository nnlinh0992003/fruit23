const ProductCategory = require("../../models/product-category.model");
module.exports.category = async (req,res,next) => {
    function createTree(arr, parentId = "") {
        const tree = [];
      
        arr.forEach((item) => {
          if (item.parent_id === parentId) {
            const newItem = item;
            const children = createTree(arr, item.id); 
            if (children.length > 0) {
              newItem.children = children;
            }
      
            tree.push(newItem); 
          }
        });
      
        return tree;
      }
  
      const productCategory = await ProductCategory.find({
        deleted: false
      });
  
      const newProductsCategory = createTree(productCategory);
      res.locals.layoutProductsCategory= newProductsCategory;
    next();
}