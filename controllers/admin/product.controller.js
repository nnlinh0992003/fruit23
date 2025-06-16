// [GET]/admin/products
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const ProductCategory = require("../../models/product-category.model");


module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    // console.log(filterStatus);

    let find = {
      deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status;
    };

    const objectSearch = searchHelper(req.query);

    const countProducts = await Product.countDocuments(find);

    if(objectSearch.regex){
        find.title = objectSearch.regex;
    };   

    //Phân trang
    let pagination = paginationHelper ({
        currentPage: 1,
        limitItems: 8
      },
      req.query,
      countProducts
    );
    // Hết Phân trang

        // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }
    // End Sort


    const products = await Product.find(find)
        .sort(sort)
        .limit(pagination.limitItems)
        .skip(pagination.skip);
    

    res.render("admin/pages/products/index", {
        pageTitle: "Quản lý sản phẩm",
        products: products,
        keyword: objectSearch.keyword,
        filterStatus: filterStatus,
        pagination: pagination
  });
};

// [PATCH] /admin/products/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
  
    await Product.updateOne({
      _id: id
    }, {
      status: status
    });
    req.flash("success","Cập nhật trạng thái thành công!");
    res.redirect("/admin/products");
};

// [PATCH] /admin/products/change-multi/:statusChange/:id
module.exports.changeMulti = async (req, res) => {
  const type =req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({_id : { $in: ids } }, { status : "active"});
      req.flash("success", `Cập nhật thành công  sản phẩm`);
      break;
    case "inactive":
      await Product.updateMany({_id : { $in: ids } }, { status : "inactive"});
      req.flash("success",`Cập nhật thành công sản phẩm`);
      break;  
    case "delete-all":
      await Product.updateMany({_id : { $in: ids } }, {
        deleted : true,
        deletedAt: new Date()
      });
      req.flash("success",`Xóa thành công sản phẩm`);
        break;
    case "change-position":
      for(const item of ids){
        let [id,position]=item.split("-");
        position =parseInt(position);

        await Product.updateOne({ _id: id},{
          position:position
        });
        req.flash("success",`Cập nhật thành công vị trí sản phẩm`);
      }  
      break;      
    default:
      break;
  }

  res.redirect("/admin/products");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({
    _id: id},{
    deleted: true,
    deletedAt: new Date()
    }
  );
  req.flash("success",`Xóa thành công sản phẩm`);
  res.redirect("/admin/products");
};


// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find ={
    deleted: false
  };
  const category = await ProductCategory.find(find);
  const newCategory = createTree(category);
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


  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề!");
    res.redirect("/admin/products/create");
    return;
  }
  
 
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

 
  
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};


// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);
    const category = await ProductCategory.find({
      deleted: false
    });
    const newCategory = createTree(category);
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
  
  
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
    });
    
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  
  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);
  
    console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
    
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};


  