$(function() {

	var $albumCon = $("#albumCon");	
	var albumTemp = _.template($("#albumTemp").html());


	$.get("/albums").done(function (data) {

		var list = data.results;		


		// template results and append to DOM
		_(list).each(function (data) {
			// console.log(data.title);
			
			if (data.title.includes("Sweetheart")) {
				var $albums = $(albumTemp(data));
				$albumCon.append($albums);


			}

			
		});
	});



});