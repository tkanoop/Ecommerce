var Register = require('../models/user/userdata')
const mailer = require("../configure/otp");

var paypal = require('paypal-rest-sdk');
var Product = require('../models/admin/product')

const moment = require("moment");
const Banner = require('../models/admin/banner')
const Cart = require('../models/user/cart')
const Wishlist = require('../models/user/wishlist')
const Address = require('../models/user/address')
const Orders = require('../models/admin/order')
const coupon = require("../models/admin/coupen")




const { default: mongoose } = require('mongoose')
//paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARylcX3jP_8DBPQVShPV9enS3AaEmbjGLQh4r9O0wu5la6jbpYDlhENFXMvcfmO4y3mCtwDyG6u1abdv',
    'client_secret': 'EMdDuZ4Z8e0bpoC4GAi0F1SrWaWVV43RlCpFeCXfgC_B0nzQ4m-TbmWtn0R-f6kVAqtRfMQC1eyf_2pn'
});




// landing page

let count;
let wishlistcount;
const indexRoutes = async (req, res) => {
    try {
        if (req.session.userEmail) {

            const userdata = await Register.findOne({ email: req.session.userEmail })
            userName = userdata.yourname
            const cartData = await Cart.find({ userId: userdata._id });
            console.log(cartData);


            if (cartData.length) {
                count = cartData[0].product.length;
              console.log(count);
            } else {
                count = 0;
            }
            const wishlistData = await Wishlist.find({ userId: userdata._id });
            


            if (wishlistData.length) {
                wishlistcount = wishlistData[0].product.length;
              console.log(wishlistcount);
            } else {
                wishlistcount = 0;
            }
            const bannerData = await Banner.find({},)
           
            Product.find({}, (err, userdetails) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(userdetails)
                    res.render('user/index', { details: userdetails, sessionData: userName, bannerData,count,wishlistcount })
                    console.log();
                }
            })
        } else {
            const bannerData = await Banner.find({},)
            // const cartData = await Cart.find({ userId: userdata._id });
            // console.log(cartData);


            // if (cartData.length) {
            //     count = cartData[0].product.length;
            //   console.log(count);
            // } else {
            //     count = 0;
            // }
            // const wishlistData = await Wishlist.find({ userId: userdata._id });
            


            // if (wishlistData.length) {
            //     wishlistcount = wishlistData[0].product.length;
            //   console.log(wishlistcount);
            // } else {
            //     wishlistcount = 0;
            // }
            Product.find({}, (err, userdetails) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(userdetails)
                    res.render('user/index', { details: userdetails, sessionData: req.session.userEmail, bannerData,count,wishlistcount })
                    console.log();
                }
            })
        }
    } catch (error) {
       res.render('user/error');
    }
}

const userLogoutRoutes = (req, res) => {
    req.session.destroy()
    console.log(req.session);
    res.redirect('/')
}








const userRoutes = (req, res) => {
    res.render('user/login')
}


const userSignin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userDetails = await Register.findOne({ email: email })
        if (userDetails.password === password) {
            if (userDetails.status === true) {
                req.session.userEmail = req.body.email
                console.log("session created");


                console.log(userDetails.status)
                res.redirect('/')


            } else {
                res.render('user/login', { wrong: "You have been blocked from accessing this website" })
            }



        } else {
            res.render('user/login', { wrong: "Invalid credentials" })
        
        
        
        }
        

    } catch (error) {
        res.render('user/login', { wrong: "User not found" })

    }

}

const error=(req,res)=>{
    res.render('user/error')
}

const userSignup = (req, res) => {
    res.render('user/signup')
}
// creating a new user in database
const userRegister = async (req, res) => {
    try {
        userData = req.body;
        const email = req.body.email;
        const user = await Register.findOne({ email: email });
        if (email === user.email) {
            res.render('user/signup', { wrong: "Email id is already registered" })
        }
    } catch (error) {
        let mailDetails = {
            from: 'anooptk3@gmail.com',
            to: req.body.email,
            subject: 'User Verification',
            html: `<p>Your OTP is ${mailer.OTP}</p>`,

        };
        mailer.mailTransporter.sendMail(mailDetails, (err, data) => {
            console.log(data);
            if (err) {
                console.log(err);
            } else {
                res.render('user/otp');
                console.log("otp mailed")
            }
        })
    }

}



const otpVerification = async (req, res) => {
    try {
        if (req.body.otp == mailer.OTP) {
            console.log(userData.email)
            const user1 = new Register(userData)
            user1.save();
            res.redirect('/user/login')
        } else {
            res.render('user/otp', { wrong: 'You have entered the wrong otp' })
        }
    } catch (error) {
        res.render('user/error')
    }
}

// cart sesssion starts from here

const cartSession = async (req, res) => {
    const id = req.params.id;
    const userId = req.session.userEmail;
    const data = await Product.findOne({ _id: id });
    const userData = await Register.findOne({ email: userId });
    const objId = mongoose.Types.ObjectId(id);
    const idUser = mongoose.Types.ObjectId(userData._id);
    console.log(objId);
    

    let proObj = {
        productId: objId,
        quantity: 1,
    };
    if (data.quantity >= 1) {
        const userCart = await Cart.findOne({ userId: userData._id });
        if (userCart) {
            let proExist = userCart.product.findIndex((product) => {
                console.log(product);

                console.log(id);
                return product.productId == id;
            })
            console.log(proExist)
            if (proExist != -1) {
                Cart.updateOne({ userId: userData._id },
                    {
                        $inc: { 'product.$.quantity': 1 }

                    })



                res.json({ productExist: true });
            } else {
                Cart.updateOne(
                    { userId: userData._id },
                    { $push: { product: proObj } }
                ).then(() => {
                    res.json({ status: true });
                });

            }
        } else {
            const newCart = new Cart({
                userId: userData._id,
                product: [
                    {
                        productId: objId,
                        quantity: 1,
                    },
                ],
            });
            newCart.save().then(() => {
                res.json({ status: true });
                // 
            });
        }
    } else {
        console.log("2");
        res.json({ stock: true });
    }
}
const cartPage = async (req, res) => {


    try {


        const userId = req.session.userEmail;
        const userData = await Register.findOne({ email: userId });
        userName = userData.yourname
        const cartData = await Cart.find({ userId: userData._id });

        const wishlistData = await Wishlist.find({ userId:userData._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }
        if (cartData.length) {
            count = cartData[0].product.length;
        } else {
            count = 0;
        }
        const cartlist = await Cart.aggregate([
            {
                $match: { userId: userData._id },
            },
            {
                $unwind: "$product",
            },
            {
                $project: {
                    productItem: "$product.productId",
                    productQuantity: "$product.quantity",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productItem",
                    foreignField: "_id",
                    as: "productDetail",
                },
            },
            {
                $project: {
                    productItem: 1,
                    productQuantity: 1,
                    productDetail: { $arrayElemAt: ["$productDetail", 0] },
                },
            },
            {
                $addFields: {
                    productPrice: {
                        $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                    },
                },
            },
        ]);

        const subtotal = cartlist.reduce((accumulator, object) => accumulator + object.productPrice, 0);

        res.render("user/cart", { cartlist, sessionData: userName, subtotal,wishlistcount,count });
    } catch (error) {
       res.render('user/error')
    }
}



const changeQuantity = async (req, res, next) => {
    console.log('api called');
    const data = req.body
    console.log(data);
    data.count = Number(data.count)
    data.quantity = Number(data.quantity)
    const objId = mongoose.Types.ObjectId(data.product)
    const productDetail = await Product.findOne({ _id: data.product })
    console.log(objId);
    console.log(productDetail);
    if ((data.count == -1 && data.quantity == 1)) {
        res.json({ quantity: true })
    } else if ((data.count == 1 && data.quantity == productDetail.quantity)) {
        res.json({ stock: true });
    } else {
        await Cart
            .aggregate([
                {
                    $unwind: '$product',
                },
            ])
            .then(() => {
                Cart
                    .updateOne(
                        { _id: data.cart, 'product.productId': objId },
                        { $inc: { 'product.$.quantity': data.count } },
                    )
                    .then(() => {
                        res.json({ status: true });
                        next();
                    });
            });
    }
}



const addToWishList = async (req, res) => {
    
        try {
            const id = req.query.id
            const userEmailId = req.session.userEmail
            const userdata = await Register.findOne({ email: userEmailId })
            const userId = userdata._id
            const objId = mongoose.Types.ObjectId(id);
            const wishlistdata = await Wishlist.findOne({ userId })
            let proObj = {
                productId: objId,
                quantity: 1,
            };
            if (wishlistdata) {
                const wishlistUpdate = await Wishlist.updateOne({ userId: userId },
                    {
                        $push:  { product:proObj } 
                    })
                    console.log("here");
                res.redirect('/wishListPage')
            } else {
                const wishlistOb = new Wishlist({
                    userId: userId,
                    product: [{
                        productId: objId,
                        quantity:1,

                    }]

                })
                await wishlistOb.save();
                res.redirect('/wishListPage')
            }
        } catch (error) {
          res.render('user/error')
        }
   


}


const wishListPage = async (req, res) => {
    try {
        const userEmailId = req.session.userEmail;
        const userdata = await Register.findOne({ email: userEmailId })
        const userId = userdata._id
        const userName = userdata.yourname
        const cartData = await Cart.find({ userId: userdata._id });

        const wishlistData = await Wishlist.find({ userId:userdata._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }
        if (cartData.length) {
            count = cartData[0].product.length;
        } else {
            count = 0;
        }
        const wishlistdetails = await Wishlist.aggregate([
            {
                $match: { userId: userId },

            },
            {
                $unwind: '$product'
            },
            {
                $project: {
                    productItem: '$product.productId',
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productItem',
                    foreignField: '_id',
                    as: "wishlistdata"
                }
            },
            {
                $project: {
                    productItem: 1,
                    
                    wishlistdata: { $arrayElemAt: ["$wishlistdata", 0] },
                },
            },
           
        ])

        res.render('user/wishlist', { wishlistdetails, sessionData: userName,wishlistcount,count })
        console.log(wishlistdetails);
    } catch (error) {
       res.render('user/error')
    }

}


// single product loading
const singleProduct = async (req, res) => {
    try {
        if (req.session.userEmail) {
            const id = req.query.id;
            userdata = await Register.findOne({ email: req.session.userEmail })
            userName = userdata.yourname
            const cartData = await Cart.find({ userId: userdata._id });
        console.log(cartData);


        if (cartData.length) {
            count = cartData[0].product.length;
          console.log(count);
        } else {
            count = 0;
        }
        const wishlistData = await Wishlist.find({ userId: userdata._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }


            const product = await Product.findById({ _id: id });

            if (product) {
                res.render('user/singleProduct', { product, sessionData: userName,count,wishlistcount });

            }
        } else {
            const id = req.query.id;
            const product = await Product.findById({ _id: id });

            if (product) {
                res.render('user/singleProduct', { product, sessionData: req.body.userEmail,wishlistcount,count });

            }

        }




    } catch (error) {
        res.render('user/error')
    }
}


// user profile management starts from here

const userProfileView = async (req, res) => {
    try {
        const userData = await Register.findOne({ email: req.session.userEmail })
        userName = userData.yourname
        const cartData = await Cart.find({ userId: userData._id });
        console.log(cartData);


        if (cartData.length) {
            count = cartData[0].product.length;
          console.log(count);
        } else {
            count = 0;
        }
        const wishlistData = await Wishlist.find({ userId: userData._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }
        console.log(userName);
        res.render('user/userProfile', { sessionData: userName, userData,count,wishlistcount })

    }

    catch (error) {
       res.render('user/error')
    }

}

const editUserProfile = async (req, res) => {
    try {
        const userData = await Register.findOne({ email: req.session.userEmail })
        userName = userData.yourname
        console.log(userName);
        const cartData = await Cart.find({ userId: userData._id });
        console.log(cartData);


        if (cartData.length) {
            count = cartData[0].product.length;
          console.log(count);
        } else {
            count = 0;
        }
        const wishlistData = await Wishlist.find({ userId: userData._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }
        console.log(userName);
        res.render('user/editProfilePage', { sessionData: userName, userData,count,wishlistcount })

    }

    catch (error) {
        res.render('user/error')
    }

}

const userProfileEdited = async (req, res) => {
    try {
        password = req.body.password
        cpassword = req.body.cpassword
        id = req.query.id
        if (password === cpassword) {
            await Register.findByIdAndUpdate({ id: id }, { $set: { name: req.body.name, password: req.body.password } });

            res.redirect('/user/userProfile');
        } else {
            res.render('user/editProfilePage', { check: "Please Enter Same Password" })
        }

    } catch (error) {
        res.render('user/error')
    }
}






const addressAdded = async (req, res) => {
   
        try {
            const uid = req.session.userEmail;
            const addressDetails = await new Address({
                user_id: uid,
                address: req.body.address,
                city: req.body.city,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode,

            });



            await addressDetails.save().then((results) => {
                if (results) {
                    res.redirect('/address');
                } else {
                    res.json({ status: false });
                }
            });
        } catch (error) {
           res.render('user/error')
        }
   

}

const addressPage = async (req, res) => {
    try {
        const userEmailId = req.session.userEmail;
        const userdata = await Register.findOne({ email: userEmailId })
        const cartData = await Cart.find({ userId: userdata._id });
        console.log(cartData);


        if (cartData.length) {
            count = cartData[0].product.length;
          console.log(count);
        } else {
            count = 0;
        }
        const wishlistData = await Wishlist.find({ userId: userdata._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }

        const userName = userdata.yourname
        Address.find({ user_id: req.session.userEmail }).then((addressdetails) => {

            res.render('user/userAddress', { addressdetails, sessionData: userName,wishlistcount,count })

        })
    } catch (error) {
        res.render('user/error')
    }

}

const addAddressPage = async (req, res) => {
    try {
        const userData = await Register.findOne({ email: req.session.userEmail })
        userName = userData.yourname
        console.log(userName);
        const cartData = await Cart.find({ userId: userData._id });

        const wishlistData = await Wishlist.find({ userId:userData._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }
        if (cartData.length) {
            count = cartData[0].product.length;
        } else {
            count = 0;
        }
        res.render('user/addAddressPage', { sessionData: userName ,count,wishlistcount})

    }

    catch (error) {
       res.render('user/error')
    }

}

const viewOrderProduct = async (req, res) => {
    try {
        const sessionData = req.session.userEmail;
        const id = req.params.id;
        const objId = mongoose.Types.ObjectId(id);
        console.log(objId);
        const userData = await Register.findOne({ email: sessionData });
        const cartData = await Cart.findOne({ userId: userData.id });
        let count = cartData?.product?.length;
        const wishlistDetails = await Wishlist.findOne({ userId: userData._id });

        let wishCount = wishlistDetails?.product?.length;
        if (wishlistDetails == null) {
            wishCount = 0;
        }
        if (cartData == null) {
            count = 0;
        }
        Orders
            .aggregate([
                {
                    $match: { _id: objId },
                },
                {
                    $unwind: "$products",
                },
                {
                    $project: {
                        address: "$address",
                        totalAmount: "$finalAmount",

                        productItem: "$products.productId",
                        productQuantity: "$products.quantity",
                        discount: "$discount",
                    },
                },
                {
                    $lookup: {
                        from: 'addresses',
                        localField: 'address',
                        foreignField: '_id',
                        as: 'address',
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productItem",
                        foreignField: "_id",
                        as: "productDetail",
                    },
                },
                {
                    $project: {
                        address: 1,
                        totalAmount: 1,
                        productItem: 1,
                        productQuantity: 1,
                        discount: 1,
                        productDetail: { $arrayElemAt: ["$productDetail", 0] },
                    },
                },
            ])
            .then((productData) => {
                const addId = productData[0].address
                Address.find({ _id: addId }).then((address) => {
                    console.log(address);
                    res.render("user/viewOrderProduct", {
                        sessionData,
                        count,
                        productData,
                        wishlistcount,
                        address
                    });
                })

            });
    } catch {
        console.error();
        res.render("user/error");
    }
}



const viewOrder =
    async (req, res) => {
        try {
            const session = req.session.userEmail
            const userData = await Register.findOne({ email: session });
            sessionData = userData.yourname

            const cartData = await Cart.findOne({ userId: userData._id })
            let count = cartData?.product?.length;
            const wishlistData = await Wishlist.findOne({ userId: userData._id });
            let wishlistcount = wishlistData?.product?.length;
            if (wishlistData == null) {
                wishlistcount = 0;
            }
            if (cartData == null) {
                count = 0;
            }
            Orders.find({ user_id: userData._id })

                .then((orderDetails) => {
                    console.log(orderDetails);
                    res.render("user/order", {
                        sessionData,
                        count,
                        wishlistcount,
                        orderDetails,

                    });
                });
        } catch (error) {
           res.render('user/error')
        }
    }








const category4k = async (req, res) => {

    try {

        if (req.session.userEmail) {

            const userdata = await Register.findOne({ email: req.session.userEmail })
            userName = userdata.yourname
            const categoryData = await Product.find({ category: "4K TV'S" })
            console.log(categoryData);
            const cartData = await Cart.find({ userId: userdata._id });
            console.log(cartData);


            if (cartData.length) {
                count = cartData[0].product.length;
              console.log(count);
            } else {
                count = 0;
            }
            const wishlistData = await Wishlist.find({ userId: userdata._id });
            


            if (wishlistData.length) {
                wishlistcount = wishlistData[0].product.length;
              console.log(wishlistcount);
            } else {
                wishlistcount = 0;
            }
            res.render('user/categories', { details: categoryData, sessionData: userName,wishlistcount,count})
        } else {
            const categoryData = await Product.find({ category: "4K TV'S" })
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: req.session.userEmail,wishlistcount,count })
        }







    } catch (error) {
       res.render('user/error')
    }



}
const categoryQled = async (req, res) => {

    try {

        if (req.session.userEmail) {

            const userdata = await Register.findOne({ email: req.session.userEmail })
            userName = userdata.yourname
            const categoryData = await Product.find({ category: "QLED TV'S" })
            const cartData = await Cart.find({ userId: userdata._id });
            console.log(cartData);


            if (cartData.length) {
                count = cartData[0].product.length;
              console.log(count);
            } else {
                count = 0;
            }
            const wishlistData = await Wishlist.find({ userId: userdata._id });
            


            if (wishlistData.length) {
                wishlistcount = wishlistData[0].product.length;
              console.log(wishlistcount);
            } else {
                wishlistcount = 0;
            }
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: userName,wishlistcount,count })
        } else {
            const categoryData = await Product.find({ category: "QLED TV'S" })
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: req.session.userEmail })
        }







    } catch (error) {
       res.render('user/error')
    }



}
const categoryOled = async (req, res) => {

    try {

        if (req.session.userEmail) {

            const userdata = await Register.findOne({ email: req.session.userEmail })
            userName = userdata.yourname
            const categoryData = await Product.find({ category: "OLED TV'S" })
            const cartData = await Cart.find({ userId: userdata._id });
            console.log(cartData);


            if (cartData.length) {
                count = cartData[0].product.length;
              console.log(count);
            } else {
                count = 0;
            }
            const wishlistData = await Wishlist.find({ userId: userdata._id });
            


            if (wishlistData.length) {
                wishlistcount = wishlistData[0].product.length;
              console.log(wishlistcount);
            } else {
                wishlistcount = 0;
            }
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: userName,wishlistcount,count })
        } else {
            const categoryData = await Product.find({ category: "OLED TV'S" })
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: req.session.userEmail })
        }







    } catch (error) {
        res.render('user/error')
    }



}
const categoryLed = async (req, res) => {

    try {

        if (req.session.userEmail) {

            const userdata = await Register.findOne({ email: req.session.userEmail })
            userName = userdata.yourname
            const categoryData = await Product.find({ category: "LED TV'S" })
            console.log(categoryData);
            const cartData = await Cart.find({ userId: userdata._id });
            console.log(cartData);


            if (cartData.length) {
                count = cartData[0].product.length;
              console.log(count);
            } else {
                count = 0;
            }
            const wishlistData = await Wishlist.find({ userId: userdata._id });
            


            if (wishlistData.length) {
                wishlistcount = wishlistData[0].product.length;
              console.log(wishlistcount);
            } else {
                wishlistcount = 0;
            }
            res.render('user/categories', { details: categoryData, sessionData: userName,wishlistcount,count })
        } else {
            const categoryData = await Product.find({ category: "LED TV'S" })
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: req.session.userEmail })
        }







    } catch (error) {
       res.render('user/error')
    }

}
const search = async (req, res) => {

    try {

        if (req.session.userEmail) {

            const userdata = await Register.findOne({ email: req.session.userEmail })
            userName = userdata.yourname
            searchData = req.body.search
            console.log(req.body.search);
            const categoryData = await Product.find({ name: searchData })
            const cartData = await Cart.find({ userId: userdata._id });
            console.log(cartData);


            if (cartData.length) {
                count = cartData[0].product.length;
              console.log(count);
            } else {
                count = 0;
            }
            const wishlistData = await Wishlist.find({ userId: userdata._id });
            


            if (wishlistData.length) {
                wishlistcount = wishlistData[0].product.length;
              console.log(wishlistcount);
            } else {
                wishlistcount = 0;
            }
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: userName ,wishlistcount,count})
        } else {
            const categoryData = await Product.find({ name: req.body.search })
            console.log(categoryData);
            res.render('user/categories', { details: categoryData, sessionData: req.session.userEmail })
        }

    } catch (error) {
        res.render('user/error')
    }
}

const deleteCart = async (req, res) => {
    console.log("api called");
    const data = req.body;
    const objId = mongoose.Types.ObjectId(data.product);
    await Cart.aggregate([
        {
            $unwind: "$products",
        },
    ]);
    await Cart.updateOne(
        { _id: data.cart, "product.productId": objId },
        { $pull: { product: { productId: objId } } }
    ).then(() => {
        res.json({ status: true });
    });
}

const deleteWishlist = async (req, res) => {
    try {
        const id = req.query.id
            const userEmailId = req.session.userEmail
            const userdata = await Register.findOne({ email: userEmailId })
            const userId = userdata._id
            const objId = mongoose.Types.ObjectId(id);
           
            let proObj = {
                productId: objId,
                
            };

        const cartData = await Wishlist
            .updateOne(
                { userId: userId },
                {
                    $pull:  { product:proObj} ,
                }
            )
            .then(() => {
                res.redirect("/wishlistPage");
            });

        // console.log(cartData);
    } catch (error) {
       res.render('user/error')
    }
};

const checkoutPage = async (req, res) => {
    try {
        const userId = req.session.userEmail;
        const userData = await Register.findOne({ email: userId });
        const userName = userData.yourname
        const cartData = await Cart.find({ userId: userData._id });
        console.log(cartData);


        if (cartData.length) {
            count = cartData[0].product.length;
          console.log(count);
        } else {
            count = 0;
        }
        const wishlistData = await Wishlist.find({ userId: userData._id });
        


        if (wishlistData.length) {
            wishlistcount = wishlistData[0].product.length;
          console.log(wishlistcount);
        } else {
            wishlistcount = 0;
        }
        const cartlist = await Cart.aggregate([
            {
                $match: { userId: userData._id },
            },
            {
                $unwind: "$product",
            },
            {
                $project: {
                    productItem: "$product.productId",
                    productQuantity: "$product.quantity",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productItem",
                    foreignField: "_id",
                    as: "productDetail",
                },
            },
            {
                $project: {
                    productname: '$productDetail.name',
                    productItem: 1,
                    productQuantity: 1,
                    productDetail: { $arrayElemAt: ["$productDetail", 0] },
                },
            },
            {
                $addFields: {
                    productPrice: {
                        $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                    },
                },
            },
        ]);
        const sum = cartlist.reduce((accumulator, object) => accumulator + object.productPrice, 0);
        Address.find({ user_id: userId }).then((addressdetails) => {
            res.render('user/checkout', { cartlist, sessionData: userName, sum, addressdetails ,count,wishlistcount});
        })
    } catch (error) {
       res.render('user/error')
    }


}
const deleteAddress = async (req, res) => {
    try {
        const addressId = req.query.id;
        console.log(addressId);
        console.log(req.session.userEmail);
        const userdata = await Register.findOne({ email: req.session.userEmail })
        const Id = userdata._id
        const userName = userdata.yourname
        const userId = mongoose.Types.ObjectId(Id);

        console.log(userId);
        const cartData = await Address
            .updateOne(
                { userId: userId },
                {
                    $pull: { addressItems: { _id: addressId } },
                }
            )
            .then(() => {
                res.redirect("/address");
            });

        console.log(cartData);
    } catch (error) {
        res.render('user/error')
    }
};

let amount;
const postCheckout = async (req, res) => {
    try {
        const sessionData = req.session.userEmail
        const data = req.body
        const address = data.address
        const payment = data.paymentMethod

        const userData = await Register.findOne({ email: sessionData });
        console.log(userData);
        const userDetails = await Register.findOne({ email: sessionData }).then(async () => {
            const productData = await Cart.aggregate([
                {
                    $match: { userId: userData._id },
                },
                {
                    $unwind: "$product",
                },
                {
                    $project: {
                        productItem: "$product.productId",
                        productQuantity: "$product.quantity",
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productItem",
                        foreignField: "_id",
                        as: "productDetail",
                    },
                },
                {
                    $project: {
                        productItem: 1,
                        productQuantity: 1,
                        productDetail: { $arrayElemAt: ["$productDetail", 0] },
                    },
                },
                {
                    $addFields: {
                        productPrice: {
                            $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                        },
                    },
                },
            ])
            let dis = 0
            let sumTotal = 0
            const sum = productData.reduce((accumulator, object) => {
                return accumulator + object.productPrice
            }, 0);
            sumTotal = sum
            console.log(sum);
            count = productData.length;
            console.log(count);
            Cart.findOne({ userId: userData._id }).then((cartData) => {
                const order = new Orders({
                    order_id: Date.now(),
                    user_id: userData._id,

                    address: address,
                    order_placed_on: moment().format('DD-MM-YYYY'),
                    products: cartData.product,
                    discount: dis,
                    totalAmount: sumTotal,
                    finalAmount: Math.round(sumTotal + (sumTotal * 0.18)),
                    paymentMethod: payment,
                    expectedDelivery: moment().add(4, 'days').format('MMM Do YY'),
                });
                order.save().then((done) => {


                    const oid = done._id;
                    console.log(oid);
                    Cart.deleteOne({ userId: userData._id }).then(() => {
                        if (payment === 'cod') {
                            res.json({ successCod: true });
                        } else if (payment === 'online') {
                            amount=Math.round(done.finalAmount/84);
                            console.log(amount);
                            
                            res.json({ successPay: true })
                        }
                    });
                });

            })
        })



    } catch (error) {
       res.render('user/error')
    }
}



const getPay = async (req, res) => {

    const name=req.session.userEmail;

   
    id=name._id
    console.log(id);
    const orderData=await Orders.findOne({user_id:id})
    orderdetails=orderData
    console.log(orderdetails);

    const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "Red Sox Hat",
                            sku: "001",
                            price: amount,
                            currency: "USD",
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: "USD",
                    total: amount,
                },
                description: "Hat for the best team ever",
            },
        ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
}

const getSuccess= async (req, res) => {
    const name=req.session.userEmail;

    sessionData=name.yourname
    id=name.id
    console.log(id);
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    // getting order details
   
    const execute_payment_json = {
        payer_id: payerId,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: amount,
                },
            },
        ],
    };

    paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.render('user/success',{sessionData})
            }
        }
    );
}
const getCancel= async (req, res) => {
    res.send('Cancelled')
}




const checkCoupon = async (req, res) => {
    const data = req.body;
    console.log(data);
    const total = parseInt(data.total);
    console.log(total);
    const session = req.session.userEmail
    const userData = await Register.findOne({ email: session });
    const objId = mongoose.Types.ObjectId(userData._id);
    if (data.coupon) {
        coupon
            .find(
                { couponName: data.coupon },
                { users: { $elemMatch: { userId: objId } } }
            )
            .then((exist) => {
                console.log(exist);
                if (!exist.length) {
                    res.json({ invalid: true });
                } else if (exist[0].users.length) {
                    res.json({ user: true });
                } else {
                    coupon.find({ couponName: data.coupon }).then((discount) => {
                        console.log(discount);
                        console.log(total);
                        let dis = total * discount[0].discount;
                        console.log(dis);
                        if (total < 100) {
                            res.json({ purchase: true });
                        } else if (dis > 10000) {
                            let discountAmount = 10000;
                            res.json({
                                coupons: true,
                                discountAmount,
                                couponName: discount[0].couponName,
                            });
                        } else {
                            let discountAmount = dis;
                            res.json({
                                coupons: true,
                                discountAmount,
                                couponName: discount[0].couponName,
                            });
                        }
                    });
                }
            });
    } else {
        res.json({ exist: true });
    }
}
const orderSuccess= async (req, res) => {
    
    res.render("user/success" );

}



module.exports = {
    indexRoutes,
    error,
    userRoutes,
    userRegister,
    userSignup,
    userSignin,
    otpVerification,
    userLogoutRoutes,
    cartSession,
    singleProduct,
    cartPage,
    addToWishList,
    wishListPage,
    userProfileView,
    editUserProfile,
    userProfileEdited,
    changeQuantity,
    addressAdded,
    addressPage,
    addAddressPage,
    category4k,
    categoryQled,
    categoryOled,
    categoryLed,
    search,
    deleteCart,
    deleteWishlist,
    checkoutPage,
    deleteAddress,
    postCheckout,
    checkCoupon,
    viewOrder,
    viewOrderProduct,
    getPay,
    getCancel,
    getSuccess,
    orderSuccess



}








