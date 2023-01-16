
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)


const employeeSchema = new mongoose.Schema({
    yourname : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true

    
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    status:{
        type:Boolean,
        default:true
    },
    gender:{
        type:String,
        required:true,
        
    },
  
      address:[{
        name:String,
        home:String,
        state:String,
        pincode:String,
        email:String,
        mobile_num:String
      }],


})


const Register = mongoose.model('userdetails', employeeSchema);
module.exports = Register;
