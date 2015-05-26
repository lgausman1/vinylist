var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/vinylist");

module.exports.User = require("./user");

module.exports.Albums = require("./albums");