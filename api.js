'use strict';
const pkg = require('faker');
const {name,internet,company,address,lorem,commerce,image} = pkg;
const express = require("express");

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
const { MongoClient } = require("mongodb");
const client = new MongoClient(url);
async function start(){ await client.connect();}
start();

const app = express(); // this is the "app"
const port = process.env.PORT || 8080;     // we will listen on this port
app.use(express.json({type: ['application/json', 'text/plain']})); 
app.use(express.static('client'));

//EXPERIMENTING WITH EXPRESS.JS

app.listen(port, () => {
    console.log('App listening at http://localhost:${port}');
  });
  
app.use('/',express.static('./html')); //Serves static pages(index.html, search.html, etc.)

//Alex's MongoDB endpoints:

/**
 * TODO:
    * Frontend for search.html
        * Add form on search.html
        * Modify navbar, either:
            * make search button in navbar a link to search.html OR
            * make navbar contain a valid search form      
    * make sure that express post requests are all using body, get requests using query
    * test search endpoint
    * test edit user endpoint
    * write login endpoint
 * After tuesday
    * setup frontend for login/user authentication
*/

app.get('/search',express.urlencoded(), async (req,res) => {
    let database = client.db('petIt');
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

app.get('/user/id/view',express.json(), async (req,res) => {
    let database = client.db('petIt');
    let query = {"username": req.body.username};
    let result = await database.collection("users").findOne(query); // do I need to await these calls?
    res.end(JSON.stringify(result));
});

app.post("/register",express.json(), async (req,res) => {
    let database = client.db('petIt');
    //check if the username is in the database
    let check_query = {"username": req.body.username};
    let result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if(result !== null){
        console.log("User already exists.");
        res.end("User already exists.");
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

    //Add the user to the database
    let add_query = req.body;
    await database.collection("users").insertOne(add_query); // do I need to await these calls?
    console.log(req.body);
    res.end("Registration Successful.");
});

//TODO: Finish this function
app.post("/login",express.json(),async (req,res) => {
    let database = client.db('petIt');
    //Make sure this is a valid search request
    let requiredFields = {
        username: null,
        password: null
    };
    for(let field of Object.keys(requiredFields)){
        if(req.body[field] === null){ 
            res.end("Invalid request- missing username or password."); 
            return;
        }
    }
    //Get the user associated with the username
    let check_query = {"username": req.body.username};
    let result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if(result === null){
        console.log("User does not exist.");
        res.end("User does not exist.");
        return;
    }
    //Check if the password matches what is stored in the database
    if(req.body.password === result.password){
        //give the user an authentication token
        res.end("Successfully logged in");
    }
    else{
        res.end("Login failed.");
    }
});

//Needs testing
app.post("/user/id/edit",express.json(), async (req,res) =>{
    let database = client.db("petIt");
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

//Sam

app.get('/pet/view',express.json(), (req,res) => res.end(JSON.stringify(createFakePet(req.query.name))));

app.get('/shelter/view',express.json(), (req,res) => res.end(JSON.stringify(createFakeShelter(req.query.name))));

app.get('/user/id/favoritepets/view',express.json(), (req,res) => res.end(JSON.stringify(favoritePets(req.query.range))));

app.get('/user/id/favoriteshelters/view',express.json(), (req,res) => res.end(JSON.stringify(favoriteShelters(req.query.range))));

app.get('/user/id/recentlyviewedpets',express.json(), (req,res) => res.end(JSON.stringify(recentlyViewedPets())));

app.post("/pet/comments/create",express.json(), (req,res) => res.end("Comment Recieved"));

app.post("/user/id/favoritepets/add",express.json(), (req,res) => res.end("Added Pet to Favorites"));

app.post("/user/id/favoritepets/delete",express.json(), (req,res) => res.end("Removed Pet from Favorites"));

app.post("/pet/create",express.json(), (req,res) => res.end("Info Recieved."));

//Chat
app.get('/chat/view', (req, res) => {
    if (chat.length === 0){
        createFakeChat();
    }
    res.end(JSON.stringify(chat));}
);
app.post('/chat/msg', (req, res) => {
    chat[req.body.id].messages.push({
        key: 0,
        value: req.body.value});
    res.send('Success');});

//Shelter Page
app.get('/shelter/view', (req, res) => res.end(JSON.stringify(createFakeShelterResult(null, null))));
app.post('/shelter/edit', (req, res) => {
    console.log(req.body);
    res.send('Success');}); 

function createFakeUser(username){
    let interestIndex = Math.floor((Math.random()*3));
    let interestArray = ["dog","cats","exotics"];
    let userType = (Math.random() > 0.5) ? "adopter" : "shelter";
    let user = {
        username: username,
        email: internet.email(), 
        password: internet.password(),
        type: userType,
        interests: (userType === "adopter") ? interestArray[interestIndex] : "null",
        shelter: (userType === "shelter") ? company.companyName() : "null",
        liked_pets: [],
        viewed_pets: [],
        location: address.city(),
        num_likes: 0
    };
    //console.log(user);
    return user;
}

function createFakeLogin(){
    let login = {
        username: internet.userName(),
        password: internet.password(), 
    };
    return login;
}

function createFakeLoginToken(){
    return internet.password(); //using this as a placeholder
}

function createFakePetResult(type,query){
    let pet = {
        pet_name: name.firstName(),
        pet_location: company.companyName(),
        pet_breed: commerce.color(),
        pet_about: lorem.sentence(5,10),
        pet_health: lorem.sentence(5,10),
        pet_comments: [],
        picture: image.cats(),
        num_likes: 0
    };
    let fields = Object.keys(pet);
    if(fields.includes(type)){ //guarantees that the fake data satisfies the search constraints
        pet[type] = query;
    }
    return pet;
}

function createFakeSearchResult(type,query,quantity){
    let shelter_fields = Object.keys(createFakeShelterResult("null",""));
    let pet_fields = Object.keys(createFakePetResult("null",""));
    let returnArr = [];

    if(pet_fields.includes(type)){
        for(let i = 0;i<parseInt(quantity);i++){
            returnArr.push(createFakePetResult(type,query));
        }
    }
    else if(shelter_fields.includes(type)){
        for(let i = 0;i<parseInt(quantity);i++){
            returnArr.push(createFakeShelterResult(type,query));
        }
    }
    else{
        console.log("Invalid query type");
    }
    return returnArr;
}

//API
let database = {
    users: [],
    tokens: []
};

database.users.push(createFakeUser("Eric")); //used for testing user/id/edit
	
function createFakePet(pet_name) {
    //Pet Objects: Name, Breed, About, Health, Location, Comments, Num Likes
    let i;
    const commarr = [];
    const num_com = Math.random() * 10;
    for (i = 0; i < num_com; i++) {
        commarr.push({comment: lorem.sentence(), user: internet.userName()});
    }
    
    const pet = {
        name:  pet_name,
        breed: 'terrier',
        about: lorem.paragraph(),
        health: lorem.paragraph(),
        location: company.companyName(),
        comments: commarr,
        num_likes: Math.floor(Math.random() * 100),
        picture: image.cats()
    };
    return pet;
}

function createFakeShelter(shelter_name) {
    //Shelter Objects: Shelter Name, About, Pets, Location, Comments, Num Likes
    let i;
    const commarr = [];
    const num_com = Math.random() * 10;
    for (i = 0; i < num_com; i++) {
        commarr.push({comment: lorem.sentence(), user: internet.userName()});
    }

    const petarr = [];
    const num_pets = Math.random() * 10;
    for (i = 0; i < num_pets; i++) {
        petarr.push(createFakePet(name.firstName()));
    }

    const shelter = {
        name: shelter_name,
        about: lorem.paragraph(),
        pets: petarr,
        location: address.city(),
        comments: commarr,
        num_likes: Math.floor(Math.random() * 100),
        picture: image.business()
    };

    return shelter;
}

function favoriteShelters(range) {
    const shelters = [];
    let i;
    for (i = 0; i < range; i++) {
        shelters.push(createFakeShelter(company.companyName()));
    }
    return shelters;
}

function recentlyViewedPets() {
    const pets = [];
    let i;
    for (i = 0; i < 5; i++) {
        pets.push(createFakePet(name.firstName()));
    }
    return pets;
}

function favoritePets(range) {
    const pets = [];
    let i;
    for (i = 0; i < range; i++) {
        pets.push(createFakePet(name.firstName()));
    }
    return pets;
}

//Chat Functions
let chat = [];
function createFakeChat(){
    chat = [];
    for (let i = 0; i < 10; ++i){
        let fakeName = name.findName();
        let messages = [];
        for (let j = 0; j < 5; ++j){
            let sentence1 = lorem.sentence();
            let sentence2 = lorem.sentence();
            messages.push({'key': 0, 'value': sentence1});
            messages.push({'key': 1, 'value': sentence2});
        }
        chat.push({
            id: i,
            name: fakeName,
            messages: messages
        });
    }
    return chat; 
}

function msgChat(req, res){
    console.log(req.body.id);
    console.log(req.body.value);
    res.send();
}

//Shelter Functions
function createFakeShelterResult(type,query){    
    let shelter = {        
        shelter_name: company.companyName(),        
        shelter_location: company.companyName(),        
        shelter_about: lorem.sentence(5,10),        
        shelter_pets: null,        
        shelter_comments: [],        
        picture: image.cats()    
    };    
    let petArr = [];    
    for(let i = 0; i < 10;i++){       
        petArr.push(createFakePetResult("location",shelter.shelter_name))   
    }   
    shelter.shelter_pets = petArr;   
    let fields = Object.keys(shelter); 
    if(fields.includes(type)){ //guarantees that the fake data satisfies the search constraints        
        shelter[type] = query;    
    }   
    return shelter;
}

//Handles search requests and returns search results (with fake data)
function search(req,res){
    let options = req.query;
    res.end(JSON.stringify(createFakeSearchResult(options.type,options.query,options.quantity)));
}

//Handles login requests and returns a fake session token(will be replaced in future milestones.)
function login(req, res){
    let options = req.body;
    console.log(options);
    if((options.username === null) || (options.password === null)){
        //validates that sufficient information was passed in for the login attempt to occur
        res.end("Login attempt failed- Invalid request.");
        return;
    }
    else if(Math.random() > 0.5){ //50% Chance of success on login to simulate successful or unsuccessful login attempts
        //if login succeeds
        let newToken = createFakeLoginToken();
        database.tokens.push(newToken);
        res.end(JSON.stringify(newToken));
    }
    else{
        //if login failed
        res.end("Login attempt failed- Username and/or Password incorrect.");
    }
}

//Edits user data stored on the server.
// some fields not successfully received
function userEdit(req,res){
    let options = req.body;
    console.log("Edit request, Body:",JSON.stringify(options));
    res.end("Request received successfully.");   
}


