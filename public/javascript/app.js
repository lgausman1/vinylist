
var userIsLoggedIn = false;

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
			// append username to dom header			
			$("#loggedOutNav").html("<p id='loggedInNav'>Welcome " + user + "</p>" );
			// append like button to template
			$(".likeButton").removeClass("hidden");
			// flip flag
			userIsLoggedIn = true;
			// hiding modal
			$("#loginModal").modal('hide');
		})
	})

	var render  = function (list) {
		// clear div before appending new results
		$("#albumCon").html("");
		// console.log( list );
		// template results and append to DOM
		_(list).each(function (data) {	
			// Filter results to only show titles
			// with name in it
			if (data.title.includes( albumTitle )) {
				
				if (data.catno) {					
					var $albums = $(albumTemp(data));
					$albumCon.append($albums);
				}

			}			
		});
	};

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
		$.post("/albums", string).done(function (data) {
			// reset the form
			$newSearch[0].reset();			
			var list = data.results;
			// console.log(list);
			//render to dom
			render(list);
		});				
	})

	// favorite album
	$(".likeButton").on("click", function (x) {
		alert("working");
	})

	// Properly formats each word for search
	function capitalizeEachWord(str) {
	    return str.replace(/\w\S*/g, function(txt) {
	        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	}


});