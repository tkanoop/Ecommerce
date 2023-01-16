var Register=require('../models/user/userdata')

var Product=require('../models/admin/product')

const Category = require('../models/admin/category')
const Address = require('../models/user/address')


const Banner=require('../models/admin/banner')
const coupon=require('../models/admin/coupen')
const Orders = require("../models/admin/order");
const moment = require("moment");
const { find } = require('../models/user/userdata')
moment().format();




const adminLoginRoutes=(req,res)=>{
    res.render('admin/index')
}

const user = {
    email: 'anooptk3@gmail.com',
    passwd: '1'
}


const adminDashboard=(req,res)=>{
    if (req.body.email === user.email && req.body.password === user.passwd) {
        req.session.adminId=req.body.email
        console.log('session created');
        res.redirect('/admin/dashboard')

    }
}


const adminDashboardData=async(req,res)=>{
    
        try {
          // eslint-disable-next-line no-unused-vars
          const userCount = await Register.countDocuments({});
          const productCount = await Product.countDocuments({});
          const orderData = await Orders.find({ orderStatus: { $ne: 'Cancelled' } });
          const orderCount = await Orders.countDocuments({});
          const pendingOrder = await Orders.find({ orderStatus: 'Pending' }).count();
          const completed = await Orders.find({ orderStatus: 'Completed' }).count();
          const delivered = await Orders.find({ orderStatus: 'Delivered' }).count();
          const cancelled = await Orders.find({ orderStatus: 'Cancelled' }).count();
          const cod = await Orders.find({ paymentMethod: 'COD' }).count();
          console.log(cod);
          const online = await Orders.find({ paymentMethod: 'Online' }).count();
          // eslint-disable-next-line arrow-body-style
          const totalAmount = orderData.reduce((accumulator, object) => {
            // eslint-disable-next-line no-return-assign, no-param-reassign
            return (accumulator += object.totalAmount);
          }, 0);
          res.render('admin/dashboard', {
            usercount: userCount,
            productcount: productCount,
            totalamount: totalAmount,
            ordercount: orderCount,
            pending: pendingOrder,
            completed,
            delivered,
            cancelled,
            cod,
            online,
          });
        } catch (error) {
          res.redirect('/500');
        }
      }
    
    


const loadUser=(req,res)=>{
    try {
        Register.find({}, (err, userdetails) => {
            if (err) {
                console.log(err);
            } else {
                res.render('admin/users', { details: userdetails })
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}





const updateUser = async (req, res) => {
    try {
        const check=await Register.findById({_id:req.query.id});
        
        if(check.status==true){
            await Register.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:false } });
        console.log(check.status)
        }else{
            await Register.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:true} });
            console.log(check.status)
        }
        res.redirect('/admin/adminhome');
    } catch (error) {
        console.log(error.message);
    }
}

//  admin logout
const logoutRouter=(req,res)=>{
    res.redirect('/admin')
}




// category management starts from here

const getAddCategory= (req, res) => {
    res.render('admin/addCategory')
}
const insertCategory=async (req, res) => {
    try {
      let name1=await Category.findOne({name:req.body.name})
      yourname=name1.name;
      console.log(name1.name);
      if (yourname==req.body.name){
        res.render('admin/addCategory',{check:'Category already exist'})

      }else{
        let category = new Category({
            name: req.body.name,
            image: req.file.filename,
          
        })
        console.log(req.file.filename);
        category.save();
      

        res.redirect('/admin/category');
      }
    } catch (error) {
        console.log(error.message);
    }
}


const getCategory= async (req, res) => {
    try {
        Category.find({}, (err, userdetails) => {
            if (err) {
                console.log(err);
            } else {
                console.log(userdetails)
                res.render('admin/category', { details: userdetails })
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const updateCategory = async (req, res) => {
    try {
        const check=await Category.findById({_id:req.query.id});
        
        if(check.status==true){
            await Category.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:false } });
        console.log(check.status)
        }else{
            await Category.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:true} });
            console.log(check.status)
        }
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
    }
}

const editCategoryPage= async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await Category.findById({ _id: id });
        if (userData) {

            res.render('admin/editCategory', { user: userData });
        } else {
            res.redirect('/admin/category');
        }

    } catch (error) {
        console.log(error.message);
    }
}


const editCategory1=async(req,res)=>{
    try {
        const id=req.query.id;
        await Category.findByIdAndUpdate({ _id:id }, { $set: { name: req.body.name, image: req.file.filename } });
        
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
    }
}



// product management starts from here



const addProduct=async(req,res)=>{
    try {
        
                Category.find({}, (err, categorydetails) => {
                    if (err) {
                        console.log(err);
                    } else {
                        
                        res.render('admin/addProduct', {user: categorydetails })
                       
                    }
                })
    } catch (error) {
        console.log(error.message);
    }
}

const productAdded=(req,res)=>{
    try {
        let product= new Product({
            name:req.body.name,
            description:req.body.description,
            category:req.body.category,
            image:req.file.filename,
            price:req.body.price,
            quantity:req.body.quantity,
        })
        product.save();
        res.redirect('/admin/productS');
        
        console.log(product);

    } catch (error) {
        console.log(error.message);
    }
}
const productPage=async (req, res) => {
    try {
        Product.find({}, (err, userdetails) => {
            if (err) {
                console.log(err);
            } else {
                console.log(userdetails)
                res.render('admin/products', { details: userdetails })
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const statusProduct = async (req, res) => {
    try {
        const check=await Product.findById({_id:req.query.id});
        
        if(check.status==true){
            await Product.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:false } });
        console.log(check.status)
        }else{
            await Product.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:true} });
            console.log(check.status)
        }
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error.message);
    }
}
const editProduct=async(req,res)=>{
    try {
        const id = req.query.id;
        const product= await Product.findById({ _id: id });
        const categoryDetails=await Category.find();
        if (product) {
                    res.render('admin/editProduct', { product,category:categoryDetails});   
        } else {
            res.redirect('/admin/products');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProduct=async(req,res)=>{
    await Product.findByIdAndUpdate({_id:req.query.id},{$set:{name:req.body.name,
        description:req.body.description,
        category:req.body.category,
        image:req.file.filename,
        price:req.body.price,
        quantity:req.body.quantity
    }})
    res.redirect('/admin/products');
}

// banner page starts from here

const bannerPage=async (req, res) => {
    try {
        Banner.find({}, (err, bannerdetails) => {
            if (err) {
                console.log(err);
            } else {
                console.log(bannerdetails)
                res.render('admin/banner', { details: bannerdetails })
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
const addBanner=async (req,res)=>{
   
        res.render('admin/addBanner')
    
}


const bannerAdded= (req, res) => {
    try {
        let banner = new Banner({
            name: req.body.name,
            title:req.body.title,
            image: req.file.filename,
          
        })
        console.log(req.file.filename);
        banner.save();
      

        res.redirect('/admin/banners');
    } catch (error) {
        console.log(error.message);
    }
}

const editBannerForm=async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await Banner.findById({ _id: id });
        if (userData) {

            res.render('admin/editBanner', { user: userData });
        } else {
            res.redirect('/admin/banner');
        }

    } catch (error) {
        console.log(error.message);
    }
}
const editedBannerForm=async(req,res)=>{
    try {
        const id=req.query.id;
        await Banner.findByIdAndUpdate({ _id:id }, { $set: { name: req.body.name, image: req.file.filename } });
        
        res.redirect('/admin/banners');
    } catch (error) {
        console.log(error.message);
    }
}


const updateSingleBanner=async (req, res) => {
    try {
        const check=await Banner.findById({_id:req.query.id});
        
        if(check.status==true){
            await Banner.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:false } });
        console.log(check.status)
        }else{
            await Banner.findByIdAndUpdate({ _id: req.query.id }, { $set: { status:true} });
            console.log(check.status)
        }
        res.redirect('/admin/banners');
    } catch (error) {
        console.log(error.message);
    }
}

const getCoupons=async(req,res)=>{
    
        try {
          coupon.find().then((coupons) => {
            res.render("admin/coupen", { coupons });
          });
        } catch {
          console.error();
          res.render("user/error");
        }
      }
const  addCoupon= async(req, res) => {
    try {
      const data = req.body;
      const dis = parseInt(data.discount);
      const max = parseInt(data.max);
      const discount = dis / 100;
      nameofcoupen=await coupon.findOne({couponName:data.coupon})
      

     

      coupon
        .create({
          couponName: data.coupon,
          discount: discount,
          maxLimit: max,
          expirationTime: data.exdate,
        })
        .then(() => {
          res.redirect("/admin/coupons");
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  }


  const editCoupon= (req, res) => {
    try{
    const id = req.params.id;
    const data = req.body;
    coupon
      .updateOne(
        { _id: id },
        {
          couponName: data.coupon,
          discount: data.discount /100,
          maxLimit: data.max,
          expirationTime: data.exdate,
        }
      )
      .then(() => {
        res.redirect("/admin/coupons");
      });
    }catch{
      console.error();
      res.render('user/error');
    }
  }
  const deleteCoupon=(req,res)=>{
    const id=req.params.id;
    coupon.deleteOne({_id:id}).then(()=>{
      res.redirect('/admin/coupons');
    })
  }


//   order management 

const getOrders =async (req, res) => {
    try {
      Orders
        .aggregate([
          {
            $lookup: {
              from: "products",
              localField: "products.productId",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $lookup: {
              from: "userdetails",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            },
          },
            {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'userAddress',
        },
      },
      {
        $unwind: '$user',
      },
          { $sort: { orderDate: -1 } },
        ])
        .then((orderDetails) => {
          res.render("admin/orders", { orderDetails });
        });
    } catch {
      console.error();
      res.render("user/error");
    }
  }

const changeOrderStatus = (req, res) => {
  try {
    const { orderID, paymentStatus, orderStatus } = req.body;
    Orders.updateOne(
      { _id: orderID },
      {
        paymentStatus, orderStatus,
      },
    ).then(() => {
      res.send('success');
    }).catch(() => {
      res.redirect('/500');
    });
  } catch (error) {
    res.redirect('/500');
  }
};

const orderCompeleted = (req, res) => {
  try {
    const { orderID } = req.body;
    Orders.updateOne(
      { _id: orderID },
      { orderStatus: 'Completed' },
    ).then(() => {
      res.send('done');
    });
  } catch (error) {
    res.redirect('/500');
  }
};

const orderCancel = (req, res) => {
  try {
    const { orderID } = req.body;
    Orders.updateOne(
      { _id: orderID },
      { orderStatus: 'Cancelled', paymentStatus: 'Cancelled' },
    ).then(() => {
      res.send('done');
    });
  } catch (error) {
    res.redirect('/500');
  }
};

const getSalesReport = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const endtoday = moment().endOf('day');
    const monthstart = moment().startOf('month');
    const monthend = moment().endOf('month');
    const yearstart = moment().startOf('year');
    const yearend = moment().endOf('year');
    const daliyReport = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today.toDate(),
            $lte: endtoday.toDate(),
          },
        },
      },
      {
        $lookup:
        {
          from: 'userdetails',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },

      {
        $project: {
          order_id: 1,
          user: 1,
          paymentStatus: 1,
          finalAmount: 1,
          orderStatus: 1,
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    console.log(daliyReport);
    const monthReport = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: monthstart.toDate(),
            $lte: monthend.toDate(),
          },
        },
      },
      {
        $lookup:
        {
          from: 'userdetails',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },

      {
        $project: {
          order_id: 1,
          user: 1,
          paymentStatus: 1,
          finalAmount: 1,
          orderStatus: 1,
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    const yearReport = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: yearstart.toDate(),
            $lte: yearend.toDate(),
          },
        },
      },
      {
        $lookup:
        {
          from: 'userdetails',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          order_id: 1,
          user: 1,
          paymentStatus: 1,
          finalAmount: 1,
          orderStatus: 1,
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    res.render('admin/salesReport', { today: daliyReport, month: monthReport, year: yearReport });
  } catch (error) {
    res.redirect('/500');
  }
};





module.exports={
    adminLoginRoutes,
    updateUser,
    adminDashboard,
    loadUser,
    logoutRouter,
    addProduct,
    productAdded,
    getAddCategory
    ,getCategory,
    insertCategory,
    updateCategory,
    editCategory1,
    editCategoryPage,
    statusProduct,
    productPage,
    editProduct,
    updateProduct,
    adminDashboardData,
    bannerPage,
    addBanner,
    bannerAdded,
    editBannerForm,
    editedBannerForm,
    updateSingleBanner,
    getCoupons,
    addCoupon,
    editCoupon,
    deleteCoupon,
    getOrders,
    changeOrderStatus,
    orderCompeleted,
    orderCancel,
    getSalesReport,
}