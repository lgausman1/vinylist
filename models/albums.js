var mongoose = require("mongoose");

// album schema
var albumSchema = new mongoose.Schema ({
	title: {
		type: String
	},
	thumb: {
		type: String
	},
	uri: {
		type: String
	},
	catno: {
		type: String
	},
	id: {
		type: String		
	}	
});

var Album = mongoose.model("Album", albumSchema);

module.exports = Album;