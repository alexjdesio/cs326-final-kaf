
 # Part 0: Project API Planning
 Viewing Pages
 - when viewing a pet page, the client sends a request with the name of the pet to be displayed, and is returned a JSON object with all of the pet information that will be displayed on the pet page, including if the pet has been liked 
 - when viewing a shelter page, the client sends a request with the name of the pet to be displayed, and is returned a JSON object with all of the pet information that will be displayed on the pet page.
 - when viewing a user page, the client sends a request with their session token, and is returned a JSON object with all of their user information
 - 
Search
 - client can request search results using a search type(pet/shelter), the query(“sparky”), and the offset(?) if applicable for multiple pages of results
 - 
Chat
 - client can request chat logs between themselves and another user using a token to authenticate their identity
 - client can send a chat message and update the chat log stored on the server

Login
 - client can request login validation with a username and password and will be returned a session token
client can request that the session token is deleted(logout)

Creating Pages
 - client can submit a new pet entry to the server using the pet form, which will can be identified by the pet name
 - client can submit a new shelter entry to the server using the shelter form, which will can be identified by the shelter name
 
Liking Pets/Shelters
 - Client can like and unlike a pet/shelter, both of which will notify the server
 
Signup
 - Client can create a new account using the sign up form, which will be stored by the server.


<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/userhome.PNG" />
Here, when the user clicks view more, they Read 4 more of their favorite pets.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/sign%20up.PNG" />
Here, when the user fills out the form and sends it in, a new user is Created.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/petpage.PNG" /> 
Here, when the user clicks remove pet from favorites, the pet is Deleted from their favorite pets.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/settings.PNG" />
Here, when the user submits the filled out form, their information is Updated to include be the new information. 

Link: https://cs326-final.herokuapp.com

Division of Labor
Sam: pet page, user homepage, pet form and all the related endpoints.
Alex: navbar, homepage, log in, sign up form, settings form, search, and all the related enpoints.
Joe: chat, shelter page and all related endpoints, handled most of heroku deployment