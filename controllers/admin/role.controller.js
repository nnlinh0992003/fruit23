const Role = require("../../models/role.model")

// [GET]/admin/role
module.exports.index = async (req, res) =>{
    let find = {
        deleted: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index",{
        pageTitle:"Nhóm quyền",
        records: records
    });
}

// [GET]/admin/role/create
module.exports.create = async (req, res) =>{
    

    res.render("admin/pages/roles/create",{
        pageTitle:" Tạo nhóm quyền",
    });
}

// [POST]/admin/role/create
module.exports.createPost = async (req, res) =>{
    
    const record = new Role(req.body);
    await record.save();
    res.redirect("/admin/roles");

}

//[GET]/admin/roles/permissions

module.exports.permissions = async(req,res) =>{
    let find = {
        deleted: false
    };
    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions",{
        pageTitle:"Phân quyền",
        records: records
    });
};


//[PATCH]/admin/roles/permissions

module.exports.permissionsPatch = async (req,res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions){
            await Role.updateOne({_id: item.id},{permissions: item.permissions});

        }
        req.flash("success","Cập nhật phân quyền thành công");
        res.redirect("/admin/roles/permissions");
    } catch (error) {
        req.flash("success","Cập nhật phân quyền thành công");
        res.redirect("/admin/roles/permissions");
    }

    
   
  
};