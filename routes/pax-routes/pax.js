const express = require("express");
const router = express.Router();
const Pax = require("../../models/Pax.model");
const TravelData = require("../../models/Travel.model");
const User = require("../../models/User.model");
const Flight = require("../../models/Flight.model");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const isLoggedIn = require("../../middleware/isLoggedIn");
const isLoggedOut = require("../../middleware/isLoggedOut");

const saltRounds = 10;

router.get("/data/:id", isLoggedIn, (req, res, next) => {
  
  Pax.findById(req.params.id)
  .then((paxDataFromDb)=> {
    console.log({paxDataFromDb});
    res.render("pax/data", {Pax: paxDataFromDb, flightId:req.params.id});
  // res.render("pax/data");
  })
  .catch((err) => next(err));

});

router.post("/details/:flightId", isLoggedIn, (req, res, next)=> {
  console.log(req.body)
  Pax.create(req.body)
    .then(createdPaxData => {
      console.log({createdPaxData});
      User.findByIdAndUpdate(
          req.session.user._id,
                {
                    $push: { paxData: createdPaxData._id },
                },
                { new: true }
            )
                .then((updatedUser) => {
                    req.session.user = updatedUser;
                    // console.log({ updatedUser, createdTrip });
                    res.render('pax/details', {pax: createdPaxData, userId: updatedUser._id, flightId: req.params.flightId});
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

router.get("/update/:flightId", isLoggedIn, (req, res, next) => {
    Pax.findById(req.params.flightId)
        .then((paxDataFromDb) => {
          console.log({paxDataFromDb});
                    res.render("pax/update", {pax: paxDataFromDb});
        }) 
                .catch((err) => next(err));
});

router.post("/update/:id", isLoggedIn, (req, res, next) => {
  console.log("hitting this route", req.params.id)
    Pax.findByIdAndUpdate(req.params.id, {...req.body}, {new: true})
        .then((paxDataFromDb) => {
          console.log({paxDataFromDb});
                    res.render("pax/details", {pax: paxDataFromDb, flightId: req.params.id, userId: req.user._id});
        }) 
                .catch((err) => next(err));
});

router.get("/deletepax/:travelId/:id/:paxId", (req, res, next) => {
  console.log("my id", req.params.paxId);
 Pax.findByIdAndRemove(req.params.paxId)
                .then((deletedPax) => {
                    console.log({ DeleteMessage: "successfully deleted passenger data" });
                    console.log(deletedPax);
                    // res.redirect(`/pax/data/${req.params.travelId, req.params.id}`);
                    res.redirect("/flight/myflight");
                })
                .catch((err) => next(err));
      });


module.exports = router;     