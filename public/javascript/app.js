$(function() {

	var $albumCon = $("#albumCon");	
	var $newSearch = $("#newSearch");
	var albumTemp = _.template($("#albumTemp").html());
	var albumTitle;


	// $.get("/albums").done(function (data) {
	// 	var list = data.results;
	// 	render(list);		
	// });	


	var render  = function (list) {
		// clear div before appending new results
		$("#albumCon").html("");
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

	// Properly formats each word for search
	function capitalizeEachWord(str) {
	    return str.replace(/\w\S*/g, function(txt) {
	        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	}


});