var userIsLoggedIn = false;
var allRenderedAlbums = [];
var currentUser;
var userId;
var favorites = [];
var albumCount;
var favoriteList = false;
var heart = true;
var discogIdArray = [];

$(function() {

	var $albumCon = $("#albumCon");	
	var $newSearch = $("#newSearch");
	var albumTemp = _.template($("#albumTemp").html());
	var albumTitle;
	var loginForm = $("#newLogin")
	

	//login
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
			albumCount = user.albums;
			// get album discog ids
			for (var i = 0; i < albumCount.length; i++) {				
				$.get("/discogid", {id: albumCount[i]}).done(function (items) {
					var x = parseInt(items);
					discogIdArray.push(x);
				});
			}

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
					// console.log(data.id);
					//if album is in fav list, switch heart flag, then...	
					if (discogIdArray.indexOf(data.id) >= 0) {
						heart = false;
						allRenderedAlbums.push(data);				
						var $albums = $(albumTemp(data));				
						$albumCon.append($albums);
						heart = true;
					} else {
						allRenderedAlbums.push(data);				
						var $albums = $(albumTemp(data));				
						$albumCon.append($albums);
					}

				}

			}			
		});
	};

	// show favorites list
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

	// collect users favorite list
	$("#favList").on("click", function (y) {		
		$.get("/favAlbums", {id: userId}).done(function (res) {
			albumCount = res;
											
			favorites = [];
			
			alert(albumCount.length);
			
			for (var i = 0; i < albumCount.length; i++) {
				$.get("/list", {id: albumCount[i]}).done(function (res) {					
						favorites.push(res);
						alert(favorites.length);
					console.log(favorites.length, albumCount.length);					
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
	$.ajax({
		url: "/album/",
		type: 'DELETE',	
		data: {id: albumToDelete["_id"], user: userId},	
		success: function (data) {
			
			// select item
			var item = $("div[data-id='" + albumToDelete.id + "']");
			// hide it
			item.hide();

		}
	});
};

// liked album click
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


						$.post("/favorite", { _id: userId, album: data._id })

						// fill heart on page after click
						var item = $("div[data-id='" + likedAlbumObj["id"] + "']")
						var d = item[1];						
						d.setAttribute("class", "col-sm-2 glyphicon glyphicon-heart likeButton");
						



  	})
};








