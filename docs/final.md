## 1. Title
kaf
## 2. Subtitle
pet-it
## 3. Semester
Fall 2020
## 4. Overview
Our application is an adoption website that makes adopting a pet easier by integrating ideas from social media platforms into pet adoption. A user can not only like pets and shelters, they can chat with shelter owners on our website directly and comment on pets and shelters. This is the innovative part of pet-it. Rather than having to watch your email to correspond at a snail's pace, you can quickly chat with shelters on an actual chat interface while joining conversations online about different pets and shelters in the comments.
## 5. Team Members
Sam Cox - shcox
Joe Huang - joehuang1234
Alex Desio - alexjdesio
## 6. User Interface
 - Home- Landing page for the website with suggestions on where to get started with using Pet-It.
     - External links to featured articles
     - Link to featured pet, Wally
     - Link to featured shelter, Orchard Grove

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a1.jpg">

 - Navbar- Grants quick-access to all relevant links on the website. 
     - Is present on all pages on the website.
 - Shelter Form
     - Allows the user to create a new shelter, which can then have pets added to it.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a2.jpg">

 - Chat
     - Allows the user to communicate with other users in a one-on-one setting through different interpersonal channels.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a3.jpg">

 - Search
     - Allows users to search for either pets or shelters using any relevant fields declared as part of shelter or pet objects(Name, location, pet type, etc.)\
     - Links to pet pages and shelter pages depending on the specified query.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a4.jpg">


 - Sign Up
     - Allows users to register a new account to access user-only features.
     - Redirects to login on successful registration.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a5.jpg">

 - Login
    - Allows users to enter a username and password and get authorization to access user-only pages(settings, user home)
    - Redirects to user home on successful login.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a6.jpg">

 - User Home
    - Allows users to view their own liked pets and recently viewed pets for quick access.
    - Links to pet pages and shelter pages.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a7.jpg">

 - Settings
    - Allows users to modify their own settings if logged in.

<img src="https://github.com/alexjdesio/cs326-final-kaf/blob/master/images/a8.jpg">

 - Signout(not a page)
    - Allows users to sign out of their account and redirects to the login page so that they can log into another account.
## 7. APIs
| Endpoint                         | Type | Functionality                                                                                                                                                                                      |
|----------------------------------|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /login                           | POST | Given a user object containing a username and a password via POST request, either authorizes a new session for the specified user if credentials are correct, or does not create a new session.    |
| /register                        | POST | Given a user object, creates a new user object and stores it in the database collection for users.                                                                                                 |
| /logout                          | GET  | Destroys the current session(if exists) and redirects to login.html                                                                                                                                |
| /getSessionUser                  | GET  | Returns either empty string if there is no active session, or the username corresponding with the current session if there is an active session.                                                   |
| /user/id/edit                    | POST | Given a user object and sufficient credentials(a valid session matching the username of the object), updates the user object stored in the database to match the user object sent by POST request. |
| /search                          | GET  | Given a query, query type, and quantity, returns the first (quantity) results matching the query type and query as an array of results.                                                            |
| /user/id/view                    | GET  | Given a username and sufficient credentials(a valid session matching the username of the object), returns the user object corresponding to the specified user.                                     |
| /pet/view                        | GET  | Given the id of a pet, returns the corresponding pet object.                                                                                                                                       |
| /shelter/view                    | GET  | Given the id of a shelter, returns the corresponding shelter object.                                                                                                                               |
| /user/id/favoritepets/view       | GET  | Given a username and a range, returns the first (range) pets that have been liked by the specified user.                                                                                           |
| /user/id/checkfavorites          | GET  | Given a username, id (of a pet or shelter), and a type, returns whether the pet/shelter has been liked by the specified user object.                                                               |
| /user/id/favoriteshelters/view   | GET  | Given a user id and a range, returns the first (range) shelters that have been liked by the specified user.                                                                                        |
| /user/id/recentlyviewedpets/view | GET  | Given a user id, returns the first (range) shelters that have been liked by the specified user.                                                                                                    |
| /user/id/favoritepets/add        | POST | Given a username and a pet id, adds the specified pet to the array of liked pets for the specified user.                                                                                           |
| /user/id/favoritepets/delete     | POST | Given a username and a pet id, removes the specified pet from the array of liked pets for the specified user.                                                                                      |
| /pet/create                      | POST | Given a pet object, adds the pet object to the database collection for pets.                                                                                                                       |
| /chat/view                       | GET  | Returns an array containing all of the chat messages contained in the user object specified by the username of the active session.                                                                 |
| /chat/msg                        | POST | Given two usernames and a chat message, updates both user objects to include the new chat message as part of the chat field array.                                                                 |
| /shelter/create                  | POST | Given a shelter object, adds the shelter object to the database collection for shelters.                                                                                                           |
| /shelter/view                    | GET  | Given a shelter id, returns the corresponding shelter object from the database.                                                                                                                    |
| /user/id/favoriteShelters/add    | POST | Given a username and a shelter ID, adds the shelter ID to the list of favorited shelters stored in the user object linked to the given username.                                                   |
| /user/id/favoriteShelters/delete | POST | Given a username and a shelter ID, removes the shelter ID from the list of favorited shelters stored in the user object linked to the given username.                                              |
| /pet/comments/create             | POST | Given a pet id and a comment, updates the corresponding pet object to include the comment.                                                                                                         |
| /shelter/comments/create         | POST | Given a shelter id and a comment, updates the corresponding shelter object to include the comment.                                                                                                 |
## 8. Database
Here are the tables in our database:
### users
*columns:* 
 - username (string), the name of the user, must be unique 
 - email (string), the user's email
 - password (string), the user's password ran through a hash
 - type (string), shelter (string), whether the user is an adopter or a shelter 
 - liked_pets (Array), an array of ids corresponding to the pets the user has liked
 - salt (string), the salt corresponding to the user
 - chat (Array), an array of chat histories between the user and other users
### shelters
*columns:*
 - shelter_name (string), the name of the shelter
 - shelter_id (string), the shelter's unique id
 - shelter_location (string), the location of the shelter
 - shelter_about (string), a description of the shelter written by the owner
 - shelter_comments (Array), an array of comments left by other users about the shelter
 - picture (string), a picture of the shelter, to be displayed on cards
 - banner_picture (string), a banner picture of the shelter for the shelter homepage
 - location_picture (string), a picture of the shelter building
### pets
*columns:*
 - pet_name (string), the name of the pet
 - pet_location (string), the id of the shelter the pet is at
 - pet_id (string), the unique id of the pet
 - pet_type (string), the type of pet, either dog, cat or exotic
 - pet_breed (string), the pet breed or species if exotic
 - pet_about (string), a description of the pet written by the user who uploaded it
 - pet_health (string), information on the pet's health and care
 - pet_comments (Array), an array of all comments left on the pet's page by other users
 - picture (string), an image of the pet
 - num_likes (integer), the number of likes the pet has recieved 
### idCounter
*columns:*
 - type: (string), what the counter is for--could be either shelter or pet
 - idCount (integer), the current number the counter is at

The relationship between users, pets and shelters is one of the central aspects of the website's functionality. Users can store the ids of pets and shelters in their liked pets/liked shelters arrays so they can view them later on their user page. Users can also post comments on pet and shelter pages and chat with one another. Shelters store the ids of the pets in that shelter. The idCounter is accessed by both pets and shelters when they are created to get a unique id. 

## 9. URL Routes/Mappings
 - chat: Used to chat with other users. Restricted to logged in users of any kind. 
 - petpage: Used to view a pet. 
 - userhome: The user's home, where the user can view their recently viewed pets and the pets and shelters they have liked. Restricted to logged in users of any kind. 
 - index: The home page of the website. 
 - shelterPage: Used to view a shelter and access the shelter's pets. 
 - login: Used to log in.
 - search: Used to search for pets and shelters.
 - petform: Used to make a pet. Restricted to logged in shelter users with active shelters. 
 - shelterForm: Used to create a shelter. Restricted to logged in shelter users with no active shelter yet. 
 - settings: Used to change user account settings. Restricted to logged in users of any kind. 
 - signup: Used to create an account. 


## 10. Authentication/Authorization
When users enter our website, and are not logged in, they can only view the homepage, pet pages, shelter pages, the login and sign up pages and the search. They are blocked from accessing the user homepage, the chat, and the forms for creating new shelters and pets, and will be rerouted to the login page if they attempt to enter one.
When a user signs up, they create an account with a unique username and a password, which has a salt added to it when they login. They also choose a user type, adopter or shelter.
Once any user is logged in, they are allowed to access their userhome, like pets and shelters, chat with other users, and change their settings. If they attempt to enter another user's userhome, they will be rerouted out of it to the login page--they may only enter the userhome corresponding to the user logged in. 
If a user is an adopter, they have no extra privileges.
If a user is a shelter, however, they are allowed to create a shelter through the shelter form page and then post pets to that shelter through the pet form page. An adopter will be rerouted to the login if they attempt to access either the shelter creation page or pet creation page. 
## 11. Division of Labor
### For milestone 1:
Alex: Homepage, Sign Up, Sign In, Wireframes for 3 Pages, Navigation Bar
Joe: Shelter Page, Shelter Form, Chat, Wireframe for 3 Pages, Creating milestone1.md
Sam: Pet Page, Pet Form, User Page, Wireframes for 3 Pages, Comment Section
### For milestone 2:
Alex: navbar, homepage, log in, sign up form, settings form, search, and all the related enpoints.
Joe: chat, shelter page and all related endpoints, handled most of heroku deployment
Sam: pet page, user homepage, pet form and all the related endpoints, creation of milestone2.md
### For milestone 3:
Alex: user authentication (register/login), search, static file protection, settings, navbar updates
Joe: creation and display of shelter, comments, and chat, heroku deployment
Sam: creation and display of pets, userhome display and modification, frontpage updates, creation of milestone3.md 
### For the final report:
Alex: writing and recording voice for the video, User Interface and API sections of final.md
Joe: writing and recording voice for the video, editing and recording the video, bugfixes in code
Sam: writing and recording voice for the video, writing the remainder of final.md, bugfixes in code


## 12. Conclusion
Our experience with the project was difficult at times but overall pretty positive. The trouble that we ran into began mostly at Milestone 3--by building our front-end to work with faked data, we didn't realize the problems that integrating an actual database into our website would create. We all agreed that we wished we would have known better how user validation and user session were to be handled at the beginning of the project so we could have structured our front-end and endpoints around this better from the beginning. 
Through this experience we learned how important it is to really think through what something will require to be secure in the future. For example, rather than the user storing a bunch of favorite pet objects as we had it initially, we realized that the user should be storing the ids of the pets. 
We also found that, especially once our code was getting larger and larger, we benefitted greatly from updating our master branch much more regularly to make sure that one person wasn't going off in a different direction than the rest. Early on, we encountered some issues where fields of objects were being called one thing in one branch and another thing in another branch--this issue was surprisingly frustrating to pin down and prevent, but making sure to keep all of our branches as up to date as possible with eachother helped a lot. 
