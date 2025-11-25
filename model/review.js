const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = new Schema({
    comment: {
        type: String, // Use JavaScript's built-in String, not Joi's string
        required: true
    },
    rating: {
        type: Number, // This was commented out and missing
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review; // Export the model, not just the schema