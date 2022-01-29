const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: String,
        travelData: [{ type: Schema.Types.ObjectId, ref: "TravelData" }],
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;
