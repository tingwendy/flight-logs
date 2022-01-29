const { Schema, model } = require("mongoose");

const flightSchema = new Schema(
    {  
      flightNumber: String,  
      airline: String,
      aircraftType: String,
      tailNumber: String,
      flightDuration: String,
      
    },
    {
        timestamps: true,
    }
);

const Flight = model("flight", flightSchema);

module.exports = Flight;

