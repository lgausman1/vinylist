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

// var albums = {};
app.get("/albums", function (req, res) {
	var search = req.query.search;
	// if (albums[search]) {
	// 	console.log("using cached data");
	// 	res.send(albums[search])
	// } else {
	// 	console.log("requesting data from Discogs");
		// search Discogs database for the search
		dis.database().search( search, function(err, data){
			// caching data for search
	    	// albums[search] = data;
	    	res.send(data);    	
		});
	// }
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

app.get("/favAlbums", function (req, res) {
	var userId = req.query.id;
	db.User.findOne({_id: userId}, function (err, user) {
		// console.log(user);
		res.send(user.albums);
	});
})

// create a new album
app.post("/album", function (req, res) {
	var favAlbum = req.body;
	// check if album already exists in db
	// if not then create new album
	db.Album.create({
		title: favAlbum.title,
		thumb: favAlbum.thumbImg,
		uri: favAlbum.uri,
		catno: favAlbum.catno,
		id: favAlbum.id
	}, function (err, album) {
		res.send(album);
	})
}) 

// adds liked album to favorite list
app.post("/favorite", function (req, res) {
	var albumAndUsername = req.body;	
	var user = albumAndUsername._id;
	var id = albumAndUsername.album;
	db.User.update({_id: user}, 
				   {$push: {albums: id}}, function (err, user) {		
					
	})
})

app.get("/list", function (req, res) {

	var id = req.query.id;
	db.Album.findOne({_id: id}, function (err, album) {				
					res.send(album);			
			});
	
});

// collect disco id of favorite albums
app.get("/discogid", function (req, res) {
	var id = req.query.id
	db.Album.findOne({_id: id}, function (err, album) {
		res.send(album.id);
	})
})

// delete album from list
app.delete("/album", function (req, res) {
	var album = req.body;
	// console.log(album);
	db.User.update({_id: album.user}, 
	   {$pull: {albums: album.id}}, function (err, user) {
			res.send(user);		   							
	});
});

// login user
app.post("/login", function (req, res) {
	var user = req.body;	
	db.User.
	authenticate(user, 
		function (err, user) {
			if (!err) {								
				req.login(user);
				var userInfo = {id: user._id, username: user.username, albums: user.albums};			
				res.send(userInfo);

			} else {
				res.send("incorrect login");
			}
		})
});


app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
	console.log("Running!");
});