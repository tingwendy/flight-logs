const { Schema, model } = require("mongoose");

const travelDataSchema = new Schema(
    {
        departureAirport: String,
        arrivalAirport: String,
        //destinationImage: String,
        departureDate: Date | String,
        arrivalDate: Date | String,
        departureTime: String,
        arrivalTime: String, 
        PNR: String,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const TravelData = model("TravelData", travelDataSchema);

module.exports = TravelData;