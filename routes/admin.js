var express = require('express');
var router = express.Router();

const admin=require('../controller/admin')
const sessionMV=require('../middleware/session')



const upload = require('../configure/multer')
const product=require('../configure/multerProd')


router.get('/',sessionMV.verifyLoginAdminWithoutSession,admin.adminLoginRoutes)
router.get('/adminhome',sessionMV.verifyLoginAdmin, admin.loadUser)
router.post('/dashboard',admin.adminDashboard)
router.get('/dashboard',sessionMV.verifyLoginAdmin,admin.adminDashboardData)
router.get('/updateUser',sessionMV.verifyLoginAdmin, admin.updateUser);
router.get('/logout',sessionMV.verifyLoginAdmin,admin.logoutRouter)

router.get('/error',admin.errorPage)

// category management starts from here
router.get('/addCategory',sessionMV.verifyLoginAdmin,admin.getAddCategory)
router.get('/category',sessionMV.verifyLoginAdmin,admin.getCategory)
router.post('/addCategory',sessionMV.verifyLoginAdmin, upload.single('image'), admin.insertCategory);
router.patch('/order_update',sessionMV.verifyLoginAdmin,admin.updateCategory)
router.get('/editCategoryForm',sessionMV.verifyLoginAdmin,admin.editCategoryPage)
router.post('/editCategoryForm',sessionMV.verifyLoginAdmin, upload.single('image'), admin.editCategory1);

// product management starts from here

router.get('/products',sessionMV.verifyLoginAdmin,admin.productPage)
router.get('/addProductPage',sessionMV.verifyLoginAdmin,admin.addProduct)
router.post('/add-product',sessionMV.verifyLoginAdmin,product.array('image',3),admin.productAdded)
router.get('/statusProduct',sessionMV.verifyLoginAdmin,admin.statusProduct)
router.get('/editProduct',sessionMV.verifyLoginAdmin, admin.editProduct)
router.post('/editProduct',sessionMV.verifyLoginAdmin, product.array('image',3), admin.updateProduct);

// banne management starts from here
router.get('/banners',sessionMV.verifyLoginAdmin,admin.bannerPage)
router.get('/addBanner',sessionMV.verifyLoginAdmin,admin.addBanner)
router.post('/addBanner',sessionMV.verifyLoginAdmin,upload.single('image'),admin.bannerAdded)
router.get('/editBannerForm',sessionMV.verifyLoginAdmin,admin.editBannerForm)
router.post('/editBannerForm',sessionMV.verifyLoginAdmin,upload.single('image'),admin.editedBannerForm)
router.get('/delete',sessionMV.verifyLoginAdmin,admin.updateSingleBanner)


// coupen management starts from here

router.get("/coupons",sessionMV.verifyLoginAdmin, admin.getCoupons);
router.post("/addCoupon",sessionMV.verifyLoginAdmin, admin.addCoupon);
router.post( "/editCoupon/:id",sessionMV.verifyLoginAdmin,   admin.editCoupon );
  
  //delete coupon 
  router.get('/deleteCoupon/:id',sessionMV.verifyLoginAdmin,admin.deleteCoupon);

  
  // order page loading
  router.get('/orders',sessionMV.verifyLoginAdmin, admin .getOrders);
  router.post('/changeStatus',sessionMV.verifyLoginAdmin,admin.changeOrderStatus);
  router.post('/orderCompleted',sessionMV.verifyLoginAdmin,admin.orderCompeleted);
  router.post('/orderCancel',sessionMV.verifyLoginAdmin,admin.orderCancel);

  router.get('/salesReport',sessionMV.verifyLoginAdmin,admin.getSalesReport);
module.exports = router;
