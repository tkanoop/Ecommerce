const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const addressSchema = new Schema({
    user_id: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        
      },
      state: {
        type: String,
        
      },
      city: {
        type: String,
        
      },
      district: {
        type: String,
        
      },
      pincode: {
        type: Number,
        required: true,
      },
    });


const Address = mongoose.model('address', addressSchema);
module.exports = Address;
