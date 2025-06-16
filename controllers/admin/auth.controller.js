const Account = require("../../models/account.model");

// [GET]/admin/authauth
module.exports.login = (req, res) =>{
    res.render("admin/pages/auth/login",{
        pageTitle:"Đăng nhập"
    });
}

// [POST]/admin/authauth
module.exports.loginPost = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect("/admin/auth/login");
        return;
    }
    if(password != Account.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("/admin/dashboard");
        return;
      }
    res.redirect("admin/dashboard");
}

// [GET]/admin/auth/logout
module.exports.logout = (req, res) =>{
    res.clearCookie("token");
    res.redirect("/admin/auth/login")
}