var mongoose = require("mongoose");

// album schema
var albumSchema = new mongoose.Schema ({
	title: {
		type: String
	},
	thumbImg: {
		type: String
	},
	discogsId: {
		type: String
	}	
});

var Album = mongoose.model("Album", albumSchema);

module.exports = Album;