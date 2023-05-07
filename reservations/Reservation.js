const {Schema, model} = require('mongoose');

const ItemSchema = new Schema({
  itemId : {
    type : Schema.Types.ObjectId,
    ref : "Menu",
    required : true,
  },
  amount : {
    type : Number,
    required : true,
  }
})

const ReservationSchema = new Schema({
  userId : {
    type: Schema.Types.ObjectId, 
    required : true,
    ref: "User"
  },
  items : {
    type : [ItemSchema],
    required : true,
  },
  date : {
    type: Date, 
    required : true,
  },
  time : {
    type: Date, 
    required : true,
  },
  totalGuest : {
    type: Number, 
    default : 1,
  },
  totalPrice : {
    type : Number,
    default : 0,
    required : true,
  },
  method : {
    type : String,
    enum : ["ovo", "visacard", "mastercard"],
    required : true,
  },
  status : {
    type : String,
    enum : ["pending", "accepted", "declined"],
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

module.exports = model("Reservation", ReservationSchema);