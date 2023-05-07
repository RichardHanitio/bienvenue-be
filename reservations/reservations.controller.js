require("dotenv").config();

const Reservation = require("./Reservation");
const asyncWrapper = require("../utils/asyncWrapper");
const {createCustomError} = require("../utils/customError");

const createReservation = asyncWrapper(async(req, res, next) => {
  const {items, date, time, totalGuest, totalPrice, method, status} = req.body;
  const userId = req.query.uid;
  !userId && next(createCustomError("User id missing", 404))
  
  !(items && date && time && totalGuest && totalPrice && method && status) && next(createCustomError("Some attributes are missing", 404))
  
  // check the items
  items.forEach(item => {
    (!(item.itemId && item.amount)) && next(createCustomError("Item attributes missing", 404))
  })

  // create a new reservation
  const reservation = await Reservation.create({userId, items, date, time, totalGuest, totalPrice, method, status});
  return res.status(200).json({
    msg : "Reservation created successfully",
    data : reservation
  })
});

const getAllReservations = asyncWrapper(async(req, res, next) => {
  const reservations = await Reservation.find().where("isDeleted").equals(false);
  return res.status(200).json({
    msg : "Reservations retrieved successfully",
    data : reservations
  })
})

const getReservation = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const reservation = await Reservation.findById(id).where("isDeleted").equals(false);
  !reservation && next(createCustomError("No reservation with id "+id+" found", 404)) 

  return res.status(200).json({
    msg : "Reservation retrieved successfully",
    data : reservation
  })
})

const deleteReservation = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const deleteReservation = await Reservation.findOneAndUpdate({_id: id}, {
    isDeleted : true,
    deletedAt : new Date(),
  }).where("isDeleted").equals(false);

  !deleteReservation && next(createCustomError("Reservation does not exist", 404))

  return res.status(200).json({
    msg : "Reservation deleted successfully",
    data : deleteReservation
  })
})

const restoreDeletedReservation = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const reservationStillExists = await Reservation.findById(id).where("isDeleted").equals(false);
  reservationStillExists && next(createCustomError("Reservation still exists!", 400));

  const restoreReservation = await Reservation.findOneAndUpdate({_id : id}, {
    isDeleted : false,
    deletedAt : null,
  }, {
    new : true, 
    runValidators : true,
  }).where("isDeleted").equals(true);

  !restoreReservation && next(createCustomError("Reservation does not exist", 404));

  return res.status(200).json({
    msg : "Reservation restored successfully",
    data : restoreReservation
  })
})


const editReservation = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const body = req.body;

  const reservation = await Reservation.findOneAndUpdate({_id: id}, body, {
    new : true,
    runValidators : true
  }).where("isDeleted").equals(false);
  !reservation && next(createCustomError("No reservation with id "+id+" found", 404)) 

  return res.status(200).json({
    msg : "Reservation edited successfully",
    data : reservation
  })
})

module.exports = {createReservation, getAllReservations, getReservation, deleteReservation, restoreDeletedReservation, editReservation}