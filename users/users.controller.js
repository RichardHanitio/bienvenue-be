require("dotenv").config();

const bcrypt = require("bcrypt")
const User = require("./User");
const asyncWrapper = require("../utils/asyncWrapper");
const {createCustomError} = require("../utils/customError");

const createUser = asyncWrapper(async(req, res, next) => {
  const {email, username, phoneNum, password} = req.body;
  !(email && username && phoneNum && password) && next(createCustomError("Some attributes are missing", 400))
  
  // check if the user already exists
  const existingUser = await User.findOne({email}).where("isDeleted").equals(false);
  existingUser && next(createCustomError("User already exists", 409))
  
  // create a new user
  const passwordBcrypt = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS));
  const user = await User.create({email, username, phoneNum, password : passwordBcrypt});
  return res.status(200).json({
    msg : "User created successfully",
    data : user
  })
});

const getAllUsers = asyncWrapper(async(req, res, next) => {
  const users = await User.find().where("isDeleted").equals(false);
  return res.status(200).json({
    msg : "Users retrieved successfully",
    data : users
  })
})

const getUser = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const user = await User.findById(id).where("isDeleted").equals(false);
  !user && next(createCustomError("No user with id "+id+" found", 404)) 

  return res.status(200).json({
    msg : "User retrieved successfully",
    data : user
  })
})

const deleteUser = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const deleteUser = await User.findOneAndUpdate({_id: id}, {
    isDeleted : true,
    deletedAt : new Date(),
  }).where("isDeleted").equals(false);

  !deleteUser && next(createCustomError("User does not exist", 404))

  return res.status(200).json({
    msg : "User deleted successfully",
    data : deleteUser
  })
})

const restoreDeletedUser = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const userStillExists = await User.findById(id).where("isDeleted").equals(false);
  userStillExists && next(createCustomError("User still exists!", 400));

  const restoreUser = await User.findOneAndUpdate({_id : id}, {
    isDeleted : false,
    deletedAt : null,
  }, {
    new : true, 
    runValidators : true,
  }).where("isDeleted").equals(true);

  !restoreUser && next(createCustomError("User does not exist", 404));

  return res.status(200).json({
    msg : "User restored successfully",
    data : restoreUser
  })
})


const editUser = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  // encrypt in frontend
  const encryptedBody = encryptor.encrypt(req.body);
  const body = encryptor.decrypt(encryptedBody);

  // encrypt the password if it's changed
  body.password && (body.password = await bcrypt.hash(body.password, parseInt(process.env.SALTROUNDS)));

  const user = await User.findOneAndUpdate({_id: id}, body, {
    new : true,
    runValidators : true
  }).where("isDeleted").equals(false);
  !user && next(createCustomError("No user with id "+id+" found", 404))

  return res.status(200).json({
    msg : "User edited successfully",
    data : user
  })
})

module.exports = {createUser, getAllUsers, getUser, editUser, deleteUser, restoreDeletedUser}