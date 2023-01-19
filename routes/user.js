var express = require('express');
var router = express.Router();




const user=require('../controller/user')
const sessionMV=require('../middleware/session')
router.get('/',user.indexRoutes)
router.get('/user/login',sessionMV.verifyLoginUserWithoutSession,user.userRoutes)
router.post("/userhome",user.userSignin)
router.get('/user_signup',user.userSignup)
router.get('/error',user.error)

// otp generation starts from here

router.post("/user_signup",user.userRegister)
router.post('/otp', user.otpVerification);
router.get('/logout',sessionMV.verifyLoginUser,user.userLogoutRoutes)


// cart page starts from here

router.get('/cartPage',sessionMV.verifyLoginUser,user.cartPage)
router.get('/addToCart/:id',sessionMV.verifyLoginUser,user.cartSession);
router.post('/changeQuantity',sessionMV.verifyLoginUser,user.changeQuantity)
router.post('/removeProduct',sessionMV.verifyLoginUser,user.deleteCart)

// wishlist page starts from here
router.get('/wishListPage',sessionMV.verifyLoginUser,user.wishListPage)
router.get("/addtowishlist",sessionMV.verifyLoginUser,user.addToWishList)
router.get("/removewishlistProduct",sessionMV.verifyLoginUser,user.deleteWishlist)


// code for loading single product
router.get('/singleProduct',user.singleProduct)


// code for loading user profile
router.get('/userProfile',user.userProfileView)
router.get('/editUserProfile',sessionMV.verifyLoginUser,user.editUserProfile)
router.post('/editUserProfile',user.userProfileEdited)
router.get('/address',sessionMV.verifyLoginUser,user.addressPage)
router.get('/addAddress',sessionMV.verifyLoginUser,user.addAddressPage)
router.post('/addressAdded',sessionMV.verifyLoginUser,user.addressAdded)
router.get('/deleteAddress',sessionMV.verifyLoginUser,user.deleteAddress)
router.get('/orders',sessionMV.verifyLoginUser,user.viewOrder)
router.get('/viewOrderProducts/:id',sessionMV.verifyLoginUser,user.viewOrderProduct)




// for loading categories
router.get('/category4k',user.category4k)
router.get('/categoryQled',user.categoryQled)
router.get('/categoryOled',user.categoryOled)
router.get('/categoryLed',user.categoryLed)

// search result
router.post('/search',user.search)


// checkout page loading

router.get('/checkoutPage',sessionMV.verifyLoginUser,user.checkoutPage)
router.post('/placeOrder',sessionMV.verifyLoginUser,user.postCheckout)
router.get("/pay",sessionMV.verifyLoginUser,user.getPay)
router.get('/success',sessionMV.verifyLoginUser,user.getSuccess)
router.get('/cancel',sessionMV.verifyLoginUser,user.getCancel)

router.post("/checkCoupon", sessionMV.verifyLoginUser, user.checkCoupon);

// order success
router.get("/orderSuccess", user.orderSuccess );

module.exports = router;


