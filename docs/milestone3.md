# Tables
### users
*columns:* 
-username (string), the name of the user, must be unique 
-email (string), the user's email
-password (string), the user's password ran through a hash
-type (string), shelter (string), whether the user is an adopter or a shelter 
-liked_pets (Array), an array of ids corresponding to the pets the user has liked
-salt (string), the salt corresponding to the user
-chat (Array), an array of chat histories between the user and other users

### shelters
*columns:*
-shelter_name (string), the name of the shelter
-shelter_id (string), the shelter's unique id
-shelter_location (string), the location of the shelter
-shelter_about (string), a description of the shelter written by the owner
-shelter_comments (Array), an array of comments left by other users about the shelter
-picture (string), a picture of the shelter, to be displayed on cards
-banner_picture (string), a banner picture of the shelter for the shelter homepage
-location_picture (string), a picture of the shelter building

### pets
*columns:*
-pet_name (string), the name of the pet
-pet_location (string), the id of the shelter the pet is at
-pet_id (string), the unique id of the pet
-pet_type (string), the type of pet, either dog, cat or exotic
-pet_breed (string), the pet breed or species if exotic
-pet_about (string), a description of the pet written by the user who uploaded it
-pet_health (string), information on the pet's health and care
-pet_comments (Array), an array of all comments left on the pet's page by other users
-picture (string), an image of the pet
-num_likes (integer), the number of likes the pet has recieved 

### idCounter
*columns:*
type: (string), what the counter is for--could be either shelter or pet
idCount (integer), the current number the counter is at

# Division of Labor
Sam: creation and display of pets, userhome display and modification, frontpage updates 
Alex: user authentication (register/login), search, static file protection, settings, navbar updates
Joe: creation and display of shelter, comments, and chat, heroku deployment