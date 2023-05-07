const {Schema, model} = require('mongoose');

const MenuSchema = new Schema({
  name : {
    type: String, 
    required : true,
    unique : true,
  },
  category : {
    type: String, 
    required : true,
    enum : ["steak", "spaghetti", "snack", "salad", "drink"]
  },
  desc : {
    type: String, 
    required : true,
  },
  rating : {
    type: Number, 
    required : true,
    enum : [1,2,3,4,5]
  },
  discount : {
    type: Number, 
    default : 0,
  },
  price : {
    type : Number,
    required : true,
  },
  img : {
    type : String,
    required : true,
  },
  isDeleted : {
    type: Boolean,
    default : false,
  },
  deletedAt : {
    type : Date,
    default : null,
  }
}, {
  timestamps : true,
})

module.exports = model("Menu", MenuSchema);