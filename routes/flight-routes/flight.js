const express = require("express");
const router = express.Router();
const TravelData = require("../../models/Travel.model");
const User = require("../../models/User.model");
const Flight = require("../../models/Flight.model");
const Pax = require("../../models/Pax.model");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

const isLoggedIn = require("../../middleware/isLoggedIn");
const isLoggedOut = require("../../middleware/isLoggedOut");

const saltRounds = 10;

router.get("/myflight", isLoggedIn, (req, res, next) => {
  User.findById(
    req.session.user._id)
    .populate("travelData")
    .then((currentUserFromDb) => {
      console.log("my flight");
  res.render("flight/myflight", {travelData: currentUserFromDb.travelData});
    })
  });

  router.post("/aircraft", isLoggedIn, (req, res, next) => {
    var options = {
      method: 'GET',
      url: 'https://aviation-reference-data.p.rapidapi.com/icaoType/B789',
      params: { modelName: req.body.aircraftFromApi },
      headers: {
        'x-rapidapi-host': 'aviation-reference-data.p.rapidapi.com',
        'x-rapidapi-key': '537df818d4msh6ff5d91f3f16103p1f47dejsn8603917385e3'
      }
    };
    console.log("body is", req.body);
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        res.render("flight/details", { model: response.data.modelName });
      })
      .catch(function (error) {
        console.error(error);
      });
  });


router.get("/details/:id", isLoggedIn, (req, res, next) => {
  Flight.findById(req.params.id)
  .then((flightDataFromDb)=> {
    console.log({flightDataFromDb});
    res.render("flight/data", {flight: flightDataFromDb, urlId: req.params.id});
  })
  .catch((err) => next(err));

});

router.post("/details/:id", (req, res, next)=> {
  console.log(req.body)
  Flight.create(req.body)
    .then(createdFlightData => {
      console.log({createdFlightData});
      User.findByIdAndUpdate(
          req.session.user._id,
                {
                    $push: { flightData: createdFlightData._id },
                },
                { new: true }
            )
                .then((updatedUser) => {
                    // *** anytime you update data on the user, remember to update the session user data. ***
                    req.session.user = updatedUser;
                    // console.log({ updatedUser, createdTrip });
                    res.render('flight/details', {flight: createdFlightData, urlId: req.params.id});
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

router.get("/update/:id", (req, res, next) => {
  console.log("hitting this route", req.params.id)
    Flight.findById(req.params.id)
        .then((flightDataFromDb) => {
          console.log({flightDataFromDb});
                    res.render("flight/update", {Flight: flightDataFromDb, urlId: req.params.id});
        }) 
                .catch((err) => next(err));
});

router.get("/deletetraveldata/:id", (req, res, next) => {
  console.log("my id", req.params.id);
 TravelData.findByIdAndRemove(req.params.id)
                .then((deletedFlight) => {
                    console.log({ DeleteMessage: "successfully deleted travel data" });
                    console.log(deletedFlight);
                    res.redirect("/flight/myflight");
                })
                .catch((err) => next(err));
      });

router.get("/deleteflight/:travelId/:id", (req, res, next) => {
  console.log("my id", req.params.id);
 Flight.findByIdAndRemove(req.params.id)
                .then((deletedFlight) => {
                    console.log({ DeleteMessage: "successfully deleted travel data" });
                    console.log(deletedFlight);
                    res.redirect(`/flight/details/${req.params.travelId}`);
                })
                .catch((err) => next(err));
      });

module.exports = router; 