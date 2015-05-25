var express = require('express'),
	app = express(),
	path = require("path");


// serve js & css files into a public folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

// discogs API Info 
var Discogs = require('disconnect').Client;
var db = new Discogs().database();

// Authentication key and secret
var dis = new Discogs({
    consumerKey: 'MHrWjvvefTYpkodOCZxd', 
    consumerSecret: 'XflECgGpaLgBBzjbXyGuNNfzhNEvnlqw'
});

var views = path.join(__dirname, "views");

app.get('/', function (req, res) {
	var homePath = path.join(views, "home.html");
	res.sendFile(homePath);
});

app.get('/albums', function (req, res) {
	
	dis.database().search("The Byrds", function(err, data){
    res.send(data);
	});

})

app.listen(3000, function() {
	console.log("Running!");
});