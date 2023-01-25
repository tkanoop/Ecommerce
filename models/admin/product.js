
const mongoose=require('mongoose');
const{ Schema } =mongoose;
const adminproductSchema= new Schema({
    name:String,
    description:String,
    category:String,


    image:{
      type:Array

    },
    
    
    status:{
      type:Boolean,
      default:true
    },
    price: {
      type:Number
     
  },
  quantity:{
    type:Number
  }

  });
  const Adminproduct = mongoose.model('product', adminproductSchema);
  
  module.exports=Adminproduct;