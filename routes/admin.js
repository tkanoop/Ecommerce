var express = require('express');
var router = express.Router();

const admin=require('../controller/admin')
const sessionMV=require('../middleware/session')



const upload = require('../configure/multer')
const product=require('../configure/multerProd')


router.get('/',sessionMV.verifyLoginAdminWithoutSession,admin.adminLoginRoutes)
router.get('/adminhome', admin.loadUser)
router.post('/dashboard',admin.adminDashboard)
router.get('/dashboard',admin.adminDashboardData)
router.get('/updateUser', admin.updateUser);
router.get('/logout',sessionMV.verifyLoginAdmin,admin.logoutRouter)

// category management starts from here
router.get('/addCategory',admin.getAddCategory)
router.get('/category',admin.getCategory)
router.post('/addCategory', upload.single('image'), admin.insertCategory);
router.get('/updateCategory',admin.updateCategory)
router.get('/editCategoryForm',admin.editCategoryPage)
router.post('/editCategoryForm', upload.single('image'), admin.editCategory1);

// product management starts from here

router.get('/products',admin.productPage)
router.get('/addProductPage',admin.addProduct)
router.post('/add-product',product.single('image'),admin.productAdded)
router.get('/statusProduct',admin.statusProduct)
router.get('/editProduct', admin.editProduct)
router.post('/editProduct', product.single('image'), admin.updateProduct);

// banne management starts from here
router.get('/banners',admin.bannerPage)
router.get('/addBanner',admin.addBanner)
router.post('/addBanner',upload.single('image'),admin.bannerAdded)
router.get('/editBannerForm',admin.editBannerForm)
router.post('/editBannerForm',upload.single('image'),admin.editedBannerForm)
router.get('/updateBanner',admin.updateSingleBanner)


// coupen management starts from here

router.get("/coupons", admin.getCoupons);
router.post("/addCoupon", admin.addCoupon);
router.post( "/editCoupon/:id",   admin.editCoupon );
  
  //delete coupon 
  router.get('/deleteCoupon/:id',admin.deleteCoupon);

  
  // order page loading
  router.get('/orders', admin .getOrders);
  router.post('/changeStatus',admin.changeOrderStatus);
  router.post('/orderCompleted',admin.orderCompeleted);
  router.post('/orderCancel',admin.orderCancel);

  router.get('/salesReport',admin.getSalesReport);
module.exports = router;
