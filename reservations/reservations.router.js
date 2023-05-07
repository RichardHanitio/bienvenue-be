const express = require("express");
const reservationsRouter = express.Router();
const {createReservation, getAllReservations, getReservation, deleteReservation, restoreDeletedReservation, editReservation} = require("./reservations.controller");
const {verifyUser, verifyAdmin} = require("../utils/verifyToken");

reservationsRouter.route("/")
.get(verifyAdmin, getAllReservations)
.post(verifyUser, createReservation) 

reservationsRouter.route("/:id")
.get(verifyUser, getReservation)

reservationsRouter.route("/:id/edit")
.patch(verifyAdmin, editReservation)

reservationsRouter.route("/:id/delete")
.get(verifyAdmin, deleteReservation)

reservationsRouter.route("/:id/restore")
.get(verifyAdmin, restoreDeletedReservation)

module.exports = reservationsRouter;
