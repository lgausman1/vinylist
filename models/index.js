var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/vinylist");

module.exports.User = require("./user");

module.exports.Album = require("./albums");