require("dotenv").config();
const Menu = require("./Menu");
const asyncWrapper = require("../utils/asyncWrapper");
const {createCustomError} = require("../utils/customError");

const createMenu = asyncWrapper(async(req, res, next) => {
  const img = req.file;
  const {name, category, desc, rating, discount, price} = req.body;
  !(name && category && desc && rating && price && img) && next(createCustomError("Some attributes are missing", 400))
  
  // check if the menu already exists
  const existingMenu = await Menu.findOne({name}).where("isDeleted").equals(false);
  existingMenu && next(createCustomError("Menu already exists", 409))
  
  // create a new menu
  const imgPath = `/server/uploads/${img.filename}`;
  const menu = await Menu.create({name, category, desc, rating, discount, price, img:imgPath});

  return res.status(200).json({
    msg : "Menu created successfully",
    data : menu
  })
});

const getAllMenus = asyncWrapper(async(req, res, next) => {
  const menus = await Menu.find().where("isDeleted").equals(false);
  return res.status(200).json({
    msg : "Menus retrieved successfully",
    data : menus
  })
})

const getMenu = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const menu = await Menu.findById(id).where("isDeleted").equals(false);
  !menu && next(createCustomError("No menu with id "+id+" found", 404)) 

  return res.status(200).json({
    msg : "Menu retrieved successfully",
    data : menu
  })
})

const deleteMenu = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const deleteMenu = await Menu.findOneAndUpdate({_id: id}, {
    isDeleted : true,
    deletedAt : new Date(),
  }).where("isDeleted").equals(false);

  !deleteMenu && next(createCustomError("Menu does not exist", 404))

  return res.status(200).json({
    msg : "Menu deleted successfully",
    data : deleteMenu
  })
})

const restoreDeletedMenu = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))

  const menuStillExists = await Menu.findById(id).where("isDeleted").equals(false);
  menuStillExists && next(createCustomError("Menu still exists!", 400));

  const restoreMenu = await Menu.findOneAndUpdate({_id : id}, {
    isDeleted : false,
    deletedAt : null,
  }, {
    new : true, 
    runValidators : true,
  }).where("isDeleted").equals(true);

  !restoreMenu && next(createCustomError("Menu does not exist", 404));

  return res.status(200).json({
    msg : "Menu restored successfully",
    data : restoreMenu
  })
})


const editMenu = asyncWrapper(async(req, res, next) => {
  const id = req.params.id;
  !id && next(createCustomError("Id missing", 404))
  
  const body = req.body;

  const menu = await Menu.findOneAndUpdate({_id: id}, body, {
    new : true,
    runValidators : true
  }).where("isDeleted").equals(false);
  !menu && next(createCustomError("No menu with id "+id+" found", 404)) 

  return res.status(200).json({
    msg : "Menu edited successfully",
    data : menu
  })
})

module.exports = {createMenu, getAllMenus, getMenu, deleteMenu, restoreDeletedMenu, editMenu}