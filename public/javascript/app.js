
var userIsLoggedIn = false;
var allRenderedAlbums = [];
var currentUser;
var userId;
var favorites = [];
var favoriteList = false;

$(function() {

	var $albumCon = $("#albumCon");	
	var $newSearch = $("#newSearch");
	var albumTemp = _.template($("#albumTemp").html());
	var albumTitle;
	var loginForm = $("#newLogin")
	

	// capture user login info
	loginForm.on("submit", function (e) {
		// preventing page load
		e.preventDefault();
		// collect login credentials
		var logCred = { email: $( "#inputEmail3" ).val(), password: $("#inputPassword3").val() };		
		// POST request
		$.post("/login", logCred).done(function (user) {
			// console.log(user);
			currentUser = user.username;
			userId = user.id;
			// append username to dom header			
			$("#loggedOutNav").html("<p id='loggedInNav'>Welcome " + currentUser + "</p>" );
			// append list link
			$("#favList").html("See List");
			// append like button to template
			$(".likeButton").removeClass("hidden");
			// flip flag
			userIsLoggedIn = true;
			// hiding modal
			$("#loginModal").modal('hide');
		})
	})

	// render new search
	var render  = function (list) {	
		// clear div before appending new results
		$("#albumCon").html("");
		// add heart in
		if (currentUser) {
			userIsLoggedIn = true;
		}; 
		// template results and append to DOM
		_(list).each(function (data) {	
			// Filter results to only show titles
			// with name in it
			if (data.title.includes( albumTitle )) {				
				if (data.catno) {	
					allRenderedAlbums.push(data);				
					var $albums = $(albumTemp(data));				
					$albumCon.append($albums);

				}

			}			
		});
	};

	// render favorites list
	var renderFavorites  = function (list) {					
		// clear div before appending new results
		$("#albumCon").html("");		
		// remove heart
		userIsLoggedIn = false;	
		// add delete button
		favoriteList = true;
		// template results and append to DOM
		_(list).each(function (data) {	

			allRenderedAlbums.push(data);				
			var $albums = $(albumTemp(data));				
			$albumCon.append($albums);

		});

		// set delete flag back
		favoriteList = false;
	};	

	// Show users favorite list
	$("#favList").on("click", function (y) {						
		// pull id's of their liked albums
		$.get("/favorites", {_id: userId}).done(function (res) {
			var albumCount = res;
			// pull liked albums out of album db
			// reset favorites
			favorites = [];
			for (var i = 0; i < albumCount.length; i++) {
				$.get("/list", {id: res[i]}).done(function (res) {					
					favorites.push(res);					
					if (favorites.length === albumCount.length) {																
						renderFavorites(favorites);
					};
				})
				
			}						
		})			
	})

	// wait for new search
	$newSearch.on("submit", function (e) {
		// prevent page from reloading
		e.preventDefault();	
		// capture artist input
		var $artist = capitalizeEachWord( $("input[name*='artist']").val() );
		// capture album info
		albumTitle = capitalizeEachWord( $("input[name*='album']").val() );		
		// combine artist and album for search
		var string = $artist + " - " + albumTitle 		
		// POST artist name
		$.get("/albums", {search: string}).done(function (data) {
			// reset the form			
			$newSearch[0].reset();			
			var list = data.results;
			console.log(list);
			//render to dom
			render(list);
		});
	})

	// Properly formats each word for search
	function capitalizeEachWord(str) {
	    return str.replace(/\w\S*/g, function(txt) {
	        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	}


});

// delete album from favorite list
var deleteThisAlbum = function (button) {
	// select clicked items id
	var discogsId = button.getAttribute("data-id");
	var albumToDelete;
	// loop to gather items elements
	for (var i = 0; i < allRenderedAlbums.length; i++) {		
		var currentItem = allRenderedAlbums[i];
		if (currentItem.id == discogsId) {
			albumToDelete = allRenderedAlbums[i];			
			break;
		};
	};

	// DELETE request to delete album
// 	$.delete("/delete", ), 

// };

// liked album logic
function likeThisAlbum(button) {
	// var item = event.target.closest("div.album");	
	// selects the clicked items id
	var discogsId = button.getAttribute("data-id");
	var likedAlbumObj;
	// loop to gather items elements
	for (var i = 0; i < allRenderedAlbums.length; i++) {		
		var currentItem = allRenderedAlbums[i];
		if (currentItem.id == discogsId) {
			likedAlbumObj = allRenderedAlbums[i];			
			break;
		};
	};	

	$.post("/album", {id: likedAlbumObj["id"],
					  thumbImg: likedAlbumObj["thumb"],
				      title: likedAlbumObj["title"],
				      uri: likedAlbumObj["uri"],
				      catno: likedAlbumObj["catno"]} ).done(function (data) {


	$.post("/favorite", { _id: userId, album: data._id });

  	})
};








