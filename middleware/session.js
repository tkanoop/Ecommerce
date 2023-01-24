module.exports = {
    verifyLoginAdmin: (req, res, next) => {
      if (req.session.adminId) {
        next();
      } else {
        res.redirect("/admin");
      }
    },
    verifyLoginAdminWithoutSession:(req,res,next)=>{
      if(!req.session.adminId){
        next()
      }else{
        res.redirect('admin/dashboard')
      }

    },
    verifyLoginUser: (req, res, next) => {
      if (req.session.userEmail) {
        next();
      } else {
        res.redirect("/user/login");
      }
    },
    verifyLoginUserWithoutSession: (req,res,next)=>{
        if(!req.session.userEmail){
            next()
        }else{
            res.redirect('/')
        }
    }
  };