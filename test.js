const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

console.log("Type of passportLocalMongoose:", typeof passportLocalMongoose);

const userSchema = new mongoose.Schema({});
userSchema.plugin(passportLocalMongoose);

console.log("Plugin applied successfully!");