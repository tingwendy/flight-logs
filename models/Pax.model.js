const { Schema, model } = require("mongoose");

const paxSchema = new Schema(
    {
        flightNumber: String,
        travelDate: [{type: Schema.Types.ObjectId, ref:"Travel"}],
        travelClass: String,
        seatNumber: String,
        notes: String, 
    },
    {
        timestamps: true,
    }
);

const Pax = model("pax", paxSchema);

module.exports = Pax;

