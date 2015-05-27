var express = require('express'),
	bodyParser = require("body-parser"),
	app = express(),
	path = require("path"),
	db = require("./models"),
	session = require("express-session");

// body parser config
app.use(bodyParser.urlencoded({ extended: true }));

// Express sessions
app.use(session({
  secret: "SUPER STUFF",
  resave: false,
  saveUninitialized: true
}));

// serve js & css files into a public folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

// discogs API Info 
var Discogs = require('disconnect').Client;
// var db = new Discogs().database();

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

var loginHelpers = function (req, res, next) {

  req.login = function (user) {
    req.session.userId = user._id;
    req.user = user;
    return user;
  };

  req.logout = function () {
    req.session.userId = null;
    req.user  = null;
  };

  req.currentUser = function (cb) {
    var userId = req.session.userId;
    db.User.
      findOne({
        _id: userId
      }, cb);
  };

  next();
};

app.use(loginHelpers)

app.post("/albums", function (req, res) {
	// object with artist as key
	var artObj = req.body;
	// create array of all keys in the object
	// in this case there is only one
	var arr = Object.keys(artObj);
	// extract the artist name
	var artist = arr[0];
	// search Discogs database for the artist
	dis.database().search( artist, function(err, data){
    res.send(data);
	});
})

// Create a new user
app.post("/users", function (req, res) {
	var newUser = req.body.user;
	db.User.
	createSecure(newUser, function (err, user) {
		if (user) {
			req.login(user);
			res.redirect("/");
		} else {
			res.send("There was a problem!");
		}
	});
});

// login user
app.post("/login", function (req, res) {
	var user = req.body;
	console.log(user);
	db.User.
	authenticate(user, 
		function (err, user) {
			if (!err) {								
				req.login(user);			
				res.send(user.username);
				// res.redirect("/");
			} else {
				res.send("incorrect login");
			}
		})
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// Getting albums from request on page load
app.get('/albums', function (req, res) {	
	dis.database().search("The Byrds", function(err, data){
    res.send(data);
	});
})

app.listen(3000, function() {
	console.log("Running!");
});