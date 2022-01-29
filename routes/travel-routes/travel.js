const express = require("express");
const router = express.Router();
const TravelData = require("../../models/Travel.model");
const Flight = require("../../models/Flight.model");
const User = require("../../models/User.model");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

const isLoggedIn = require("../../middleware/isLoggedIn");
const isLoggedOut = require("../../middleware/isLoggedOut");

const saltRounds = 10;

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("travel/list");
});

router.post("/airport", isLoggedIn, (req, res, next) => {
  var options = {
    method: "GET",
    url: "https://airport-info.p.rapidapi.com/airport",
    params: { iata: req.body.airportFromApi },
    headers: {
      "x-rapidapi-host": "airport-info.p.rapidapi.com",
      "x-rapidapi-key": "537df818d4msh6ff5d91f3f16103p1f47dejsn8603917385e3",
    },
  };
  console.log("body is", req.body);
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      res.render("travel/list", { name: response.data.name });
    })
    .catch(function (error) {
      console.error(error);
    });
});

router.get("/details/:id", isLoggedIn, (req, res, next) => {
  //console.log(req.params.id)
  TravelData.findById(req.params.id)
    .then((travelDataFromDb) => {
      console.log({ travelDataFromDb });
      res.render("travel/details", { travelData: travelDataFromDb });
    })
    .catch((err) => next(err));
});

router.post("/details", isLoggedIn, (req, res, next) => {
  console.log(req.body);
  TravelData.create(req.body)
    .then((createdTravelData) => {
      console.log({ createdTravelData });
      User.findByIdAndUpdate(
        req.session.user._id,
        {
          $push: { travelData: createdTravelData._id },
        },
        { new: true }
      )
        .then((updatedUser) => {
          // *** anytime you update data on the user, remember to update the session user data. ***
          req.session.user = updatedUser;
          // console.log({ updatedUser, createdTrip });
          // res.render('trips/details', {trip: createdTrip});
          res.redirect(`/travel/details/${createdTravelData._id}`);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

/** Read Route - Update Flight */
router.get("/update/:id", isLoggedIn, (req, res, next) => {
  TravelData.findById(req.params.id)
    .then((travelDataFromDb) => {
      console.log({ travelDataFromDb });
      res.render("travel/update", { travelData: travelDataFromDb });
    })
    .catch((err) => next(err));
});

router.get("/delete/:id", isLoggedIn, (req, res, next) => {
  User.findByIdAndUpdate(
    req.session.user._id,
    {
      $pull: { travelData: req.params.id },
    },
    { new: true }
  )
    .then((updatedUser) => {
      console.log({ deleteTravelData: req.params.id, updatedUser });
      req.session.user = updatedUser;

      User.findByIdAndDelete(req.params.id)
        .then(() => {
          console.log({ DeleteMessage: "successfully deleted trip" });
          res.redirect("/travel");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

module.exports = router;
