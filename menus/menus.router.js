const fs = require("fs");
const express = require("express");
const menusRouter = express.Router();
const {createMenu, getAllMenus, getMenu, editMenu, deleteMenu, restoreDeletedMenu} = require("./menus.controller");
const {verifyUser, verifyAdmin} = require("../utils/verifyToken");
const multer = require("multer");

if(!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename : function (req, file, cb) {
    cb(null, Date.now()+"-"+file.originalname);
  }
});
const upload = multer({storage : storage});

menusRouter.route("/")
.get(getAllMenus)
.post(verifyAdmin, upload.single("img"), createMenu)

menusRouter.route("/:id")
.get(getMenu)

menusRouter.route("/:id/edit")
.patch(verifyAdmin, editMenu)

menusRouter.route("/:id/delete")
.get(verifyAdmin, deleteMenu)

menusRouter.route("/:id/restore")
.get(verifyAdmin, restoreDeletedMenu)

module.exports = menusRouter;
