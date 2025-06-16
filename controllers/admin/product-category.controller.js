//[GET] /admin/product-category
const systemConfig = require("../../config/system");


const ProductCategory = require("../../models/product-category.model");
module.exports.index = async (req, res) => {

    let find = {
      deleted: false,
    };

    function createTree(arr, parentId = "") {
      const tree = [];
    
      arr.forEach((item) => {
        if (item.parent_id === parentId) {
          const newItem = item;
    
          const children = createTree(arr, item.id); // Đệ quy gọi lại chính hàm này để tìm con của item hiện tại
    
          if (children.length > 0) {
            newItem.children = children;
          }
    
          tree.push(newItem); // Thêm item (và cả children nếu có) vào cây
        }
      });
    
      return tree;
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
  });
};

//[GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
      deleted: false
    };

    function createTree(arr, parentId = "") {
      const tree = [];
    
      arr.forEach((item) => {
        if (item.parent_id === parentId) {
          const newItem = item;
    
          const children = createTree(arr, item.id); // Đệ quy gọi lại chính hàm này để tìm con của item hiện tại
    
          if (children.length > 0) {
            newItem.children = children;
          }
    
          tree.push(newItem); // Thêm item (và cả children nếu có) vào cây
        }
      });
    
      return tree;
    }
    

    const records = await ProductCategory.find(find);

    const newRecords = createTree(records);

    

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const count = await ProductCategory.countDocuments({});
      req.body.position = count + 1;
    }
    
    const record = new ProductCategory(req.body);
    await record.save();
  
    res.redirect("/admin/products-category");
};


//[GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id =req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });
  
    const records = await ProductCategory.find({
      deleted: false
    });
    const newRecords = createTree(records);
  
    function createTree(arr, parentId = "") {
      const tree = [];
    
      arr.forEach((item) => {
        if (item.parent_id === parentId) {
          const newItem = item;
    
          const children = createTree(arr, item.id); // Đệ quy gọi lại chính hàm này để tìm con của item hiện tại
    
          if (children.length > 0) {
            newItem.children = children;
          }
    
          tree.push(newItem); // Thêm item (và cả children nếu có) vào cây
        }
      });
    
      return tree;
    }
  
    res.render("admin/pages/products-category/edit", {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        data: data,
        records: newRecords
        
  });
    
  } catch (error) {
    res.req("/admin/products-category");
  }
};

//[PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id =req.params.id;


    req.body.position = parseInt(req.body.position);
    
    await ProductCategory.updateOne({
      _id:id
    },req.body);
    res.redirect("/admin/products-category");
};

