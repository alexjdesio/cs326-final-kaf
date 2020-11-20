'use strict';
const express = require("express");
const minicrypt = require('./miniCrypt');
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy

const mc = new minicrypt();

//Secrets
let secrets;
let url;
if (!process.env.URL) {
    secrets = require('./secrets.json');
    url = secrets.url;
} else {
    url = process.env.URL;
}

//MongoDB Start
const { MongoClient } = require('mongodb');
const client = new MongoClient(url);
let database;
async function start(){ 
    await client.connect();
    database = client.db('petIt');
}
start();

//Express.js
const app = express(); // this is the "app"
const port = process.env.PORT || 8080;     // we will listen on this port
app.use(express.json()); 
app.use(express.static('client'));
app.listen(port, () => {
    console.log('App listening at http://localhost:${port}');
});
 
//Start of Endpoints

app.use('/',express.static('./html')); //Serves static pages(index.html, search.html, etc.)

//Alex's MongoDB endpoints:

app.get('/search',express.urlencoded(), async (req,res) => {
  });
  
//app.use('/',express.static('./html')); //Serves static pages(index.html, search.html, etc.)
app.use(express.static('html'));

//Alex's MongoDB endpoints:
const strategy = new LocalStrategy(async (username, password, done) => {
    //Check if the user exists  
    if (!findUser(username)) {
        // If no such user
        console.log("user doesn't exist");
        return done(null, false, { 'message' : 'Wrong username' });
    }

    //Get the user associated with the username
    let check_query = {"username": username};
    let result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if(result === null){
        console.log("user does not exist");
        return done(null, false, { 'message' : 'User does not exist' });
    }
    console.log(result);
    //Check if the password matches what is stored in the database for the given salt
    if(mc.check(password, result.salt, result.password)){
        console.log("login succeeded");
        return done(null, username);
    }
    else{
        console.log("login failed");
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { 'message' : 'Wrong password' });
    }
});

// App configuration

const session = {
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave : false,
    saveUninitialized: false
};

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : true})); // allow URLencoded data


// Returns true if the user exists.
async function findUser(username) {
    //check if the username is in the database
    let check_query = {"username": username};
    let result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if(result !== null){
        return true;
    }
    else{
        return false;
    }
}

// Returns true if the password matches the one stored in the database.
async function validatePassword(username, password) {
    //Make sure this is a valid search request
    //Get the user associated with the username
    let check_query = {"username": username};
    let result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if(result === null){
        console.log("User does not exist.");
        return false;
    }
    //Check if the password matches what is stored in the database for the given salt
    if(mc.check(password,result.salt,result.password)){
        return true;
    }
    else{
        return false;
    }
}

// Routes

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
	// If we are authenticated, run the next route.
	next();
    } else {
    // Otherwise, redirect to the login page.
    console.log("not authed");
	res.redirect('/login');
    }
}

/** Commented out, we might need /userhome.html restricted
app.get('/', checkLoggedIn, (req, res) => { //TODO: change this
    res.send("hello world");
    });
*/

// Priate data
/** 
app.get('/userhome', checkLoggedIn, (req, res) => { //this needs testing
    let url = '/userhome.html?username=' + req.user;
    console.log("Redirecting to:",url);
    res.redirect(url); //TODO: change to id
});
**/
// Handle post data from the login.html form.
app.get('/',checkLoggedIn,(req, res) => { res.send("hello world");}); //this needs to be defined first

app.post('/login',
    passport.authenticate('local' , {     // use username/password authentication
        'successRedirect' : '/userhome',   // when we login, go to /userhome
        'failureRedirect' : '/login'      // otherwise, back to login
    }));

app.get('/userhome', (req, res) => res.sendFile('html/userhome.html',{ 'root' : __dirname }));

// Handle the URL /login (just output the login.html file).
app.get('/login', (req, res) => res.sendFile('html/login.html', { 'root' : __dirname }));


// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out! //TODO: this has the same issue as req.isAuthenticated which is we dont know if the function is written for us
    res.redirect('/login'); // back to login
});

// Register URL
app.get('/register', (req, res) => res.sendFile('html/register.html',{ 'root' : __dirname }));

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post("/register",express.json(), async (req,res) => {
    //check if the username is in the database
    let check_query = {"username": req.body.username};
    let result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if(result !== null){
        console.log("User already exists.");
        res.redirect('/register');
        return;
    }
    //check if any of the body fields are blank/malformed
    let requiredFields = {
        username: null,
        email: null, 
        password: null,
        type: null,
    };
    for(let field of Object.keys(requiredFields)){
        if(req.body[field] === null || req.body[field] === ""){
            console.log("Malformed Input.");
            res.redirect('/register');
            return;
        }
    }
    let add_query = req.body; //set the query to be equal to the request body

    //Hash password with salt
    const salt_hash = mc.hash(req.body.password);
    const salt = salt_hash[0];
    const hash = salt_hash[1];
    //update query to include hash + salt
    add_query["password"] = hash;
    add_query["salt"] = salt;

    //Add the user to the database
    await database.collection("users").insertOne(add_query); // do I need to await these calls?
    console.log(req.body);
    res.redirect('/login');
});

//Needs testing
app.post("/user/id/edit",express.json(), async (req,res) =>{
    //check if the username is in the database
    let check_query = {"username": req.body.username};
    let result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if(result === null){
        console.log("User does not exist.");
        res.end("User does not exist.");
        return;
    }
    //check if any of the body fields are blank/malformed
    let requiredFields = {
        username: null,
        email: null, 
        password: null,
        type: null,
    };
    for(let field of Object.keys(requiredFields)){
        if(req.body[field] === null || req.body[field] === ""){
            console.log("Malformed Input.");
            res.end("Malformed Input.");
            return;
        }
    }
    //Edit the existing user data
    let edit_query = req.body;
    await database.collection("users").updateOne(check_query,edit_query); 
    userEdit();
});

app.get('/search',express.urlencoded(), async (req,res) => {
    //Make sure this is a valid search request
    let requiredFields = {
        type: null,
        query: null, 
        quantity: null,
    };
    for(let field of Object.keys(requiredFields)){
        if(req.query[field] === null){ 
            res.end("Invalid request- missing type, query, or quantity field."); 
            return;
        }
    }
    let petFields = {
        pet_name: null,
        pet_location: null,
        pet_type: null,
        pet_breed: null,
        pet_about: null,
        pet_health: null,
        pet_comments: null,
        picture: null,
        num_likes: null
    };
    let shelterFields = {
        shelter_name: null,        
        shelter_location: null,        
        shelter_about: null,        
        shelter_pets: null,        
        shelter_comments: null,        
        picture: null
    };
    //Figure out if this search will be in the pet or shelter collection
    if(req.query.type === null){
       res.end("Invalid query- missing type field.");
    }
    let collection_type;
    if(req.query.type in petFields){
        collection_type = "pets";
    }
    else if(req.query.type in shelterFields){
        collection_type = "shelters"; 
    }
    else{
        res.end("Invalid query- invalid type value.");
    }
    let query = {};
    query[req.query.type] = req.query.query;
    let result = await database.collection(collection_type).find(query,{limit: req.query.quantity});
    console.log("Search request returned: ", result);
    res.end(JSON.stringify(result));
});

//TODO: filter what's returned so that the password + salt are not returned
app.get('/user/id/view',express.json(), async (req,res) => {
    let query = {"username": req.body.username};
    let result = await database.collection("users").findOne(query); // do I need to await these calls?
    res.end(JSON.stringify(result));
});

//Sam
app.get('/pet/view',express.json(), (req,res) => res.end(JSON.stringify(createFakePet(req.query.name))));

app.get('/user/id/favoritepets/view',express.json(), (req,res) => res.end(JSON.stringify(favoritePets(req.query.range))));

app.get('/user/id/favoriteshelters/view',express.json(), (req,res) => res.end(JSON.stringify(favoriteShelters(req.query.range))));

app.post("/user/id/favoritepets/add",express.json(), (req,res) => res.end("Added Pet to Favorites"));

app.post("/user/id/favoritepets/delete",express.json(), (req,res) => res.end("Removed Pet from Favorites"));

app.post("/pet/create",express.json(), (req,res) => res.end("Info Recieved."));

//Joe******************************************************************************************************************
//Chat Endpoints
app.get('/chat/view', async (req, res) => {
    const query = {'user_id': req.query.user_id};
    const result = await database.collection('users').findOne(query); 
    res.end(JSON.stringify(result.chat));
});
//TODO Incomplete but works
app.post('/chat/msg', async (req, res) => {
    const query = {'user_id': req.query.user_id};
    const result = await database.collection('users').findOne(query); 
    let chat = result.chat;
    
    const query2 = {'user_id': req.query.fromUser_id};
    const result2 = await database.collection('users').findOne(query); 
    let chat2 = result2.chat;

    for (let x in chat){
        if (chat[x].fromUser_id === req.query.fromUser_id){
            chat[x].messages.push({ key: 0, value: req.query.value});
            break;
        }
    }
    for (let x in chat2){
        if (chat2[x].fromUser_id === req.query.user_id){
            chat2[x].messages.push({ key: 1, value: req.query.value});
            break;
        }
    }
    
    await database.collection('users').updateOne(query, {$set: {'chat': chat}});
    await database.collection('users').updateOne(query2, {$set: {'chat': chat2}});
    res.end('Success');
});

//Shelter Endpoints
app.post('/shelter/create', async (req, res) => {
    const id = await getID('shelter');
    const shelter = {        
        shelter_name: req.query.shelter_name,
        shelter_id: id,        
        shelter_location: req.query.shelter_location,        
        shelter_about: req.query.shelter_about,        
        shelter_pets: [],        
        shelter_comments: [],        
        picture: ''    
    };      
    const col = database.collection('shelters');
    await col.insertOne(shelter);
    res.end('Success');
});

app.get('/shelter/view', async (req, res) => {
    const query = {'shelter_id' : req.body.shelter_id};
    const result = await database.collection('shelters').findOne(query); // do I need to await these calls?
    res.end(JSON.stringify(result));
});

app.post('/shelter/edit', async (req, res) => {
    const shelter = {        
        shelter_name: req.query.shelter_name,
        shelter_id: req.query.shelter_id,        
        shelter_location: req.query.shelter_location,        
        shelter_about: req.query.shelter_about,        
        shelter_pets: req.query.shelter_pets,        
        shelter_comments: req.query.shelter_comments,        
        picture: req.query.shelter_picture   
    };      
    const query = {'shelter_id' : parseInt(req.query.shelter_id)};
    await database.collection('shelters').replaceOne(query, shelter);
    res.end('Success');
}); 

//Comments/recentlyViewed Endpoints
app.post("/pet/comments/create", async (req,res) => {
    const query = {'pet_id': req.query.pet_id};
    const comment = {'user_id': req.query.user_id, 'value': req.query.value};
    await database.collection('pets').updateOne(query, {$push: {'pet_comments': comment}}); 
    res.end('Success');
});

app.post("/create/comments/create", async (req,res) => {
    const query = {'shelter_id': req.query.shelter_id};
    const comment = {'user_id': req.query.user_id, 'value': req.query.value};
    await database.collection('shelters').updateOne(query, {$push: {'shelter_comments': comment}}); 
    res.end('Success');
});

//app.get('/user/id/recentlyviewedpets', async (req,res) => res.end(JSON.stringify(recentlyViewedPets())));

//Counter for user, shelter and pets
async function getID(type){
    const col = database.collection('idCounter');
    await col.updateOne(
        {type: type},
        {$inc: {idCount: 1} }
    );
    const result = await col.findOne({type: type});
    return result.idCount;
}

//*********************************************************************************************************************

//Edits user data stored on the server.
// some fields not successfully received
function userEdit(req,res){
    let options = req.body;
    console.log("Edit request, Body:",JSON.stringify(options));
    res.end("Request received successfully.");   
}
