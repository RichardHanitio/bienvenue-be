const express = require("express");
const {register, login, logout} = require("./auth.controller");
const authRouter = express.Router();

authRouter.route("/register")
.post(register)

authRouter.route("/login")
.post(login)

authRouter.route("/logout")
.get(logout)

module.exports = authRouter;
