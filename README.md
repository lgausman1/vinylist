# Vinylist


### Description

Vinylist allows users to save albums that they want to purchase to a list. Users can search for any albums that have been released, save them to a list and delete them from their list. 

### Existing Features

* Pages renders albums from Discogs API
* User is able to sign up and log in
* once logged in user is able to add albums to their list
* list is saved in database
* user is able to delete albums from their list

### Planned Features

* Responsive design
* Once album is liked, user should not be able to add album again
* Once album is liked, check to make sure it doesn't already exist in DB
* Properly alert not username already exists, email already in system, incorrect login credentials
* User sign up checks 
	* check valid email, matching passwords, and user name on front end 	
* User should be signed in automatically after signing up 


### Technologies Used
* Discogs API
* HTML
* Underscore
* Bootstrap
* Javascript
* jQuery
* Node.js
* Express

### Known bugs
* Search is very slowly rendered to page
* User is logged out when page refreshes 
* When search button is clicked witout artist or album field filled out, returns results for "20/20"
* If a user tries to sign up with an email that already exists, app crashes
