const mongoose=require('mongoose');

const bannerSchema=new mongoose.Schema({
    name:String,
    title:String,
    image: String,
    status:{
        type:Boolean,
        default:true
      }
});

const Banner=mongoose.model('banner',bannerSchema);

module.exports=Banner;