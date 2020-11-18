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

//EXPERIMENTING WITH EXPRESS.JS

app.listen(port, () => {
  console.log('App listening at http://localhost:${port}');
});

app.use('/',express.static('./html')); //Serves static pages(index.html, search.html, etc.)

app.get('/search',express.urlencoded(),search);

app.get('/user/id/view',express.json(), (req,res) => res.end(JSON.stringify(createFakeUser(req.query.username))));

app.post("/register",express.json(), (req,res) => res.end("Registration Successful."));

app.post("/login",express.json(),login); //should be POST, works when set to GET

app.post("/user/id/edit",express.json(),userEdit);

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

//POSTs should use body, GET should use query

app.get('/pet/view', async (req,res) => {
    let database = client.db('petIt');
    let query = {"pet_id": req.query.pet_id};
    let result = await database.collection("pets").findOne(query);
    res.end(JSON.stringify(result));
});

app.get('/shelter/view', async (req,res) => {
    let database = client.db('petIt');
    let query = {"shelter_id": req.query.shelter_id};
    let result = await database.collection("shelters").findOne(query);
    res.end(JSON.stringify(result));
});
//needs both the user id and the range
app.get('/user/id/favoritepets/view', checkLoggedIn(), async (req,res) => {
    let database = client.db('petIt');
    let query = {"user_id": req.query.username};
    let result = await database.collection("users").findOne(query);
    let i;
    const pet_selection = [];
    const range = (result.liked_pets.length > req.query.range) ? req.query.range : result.liked_pets.length;
    for (i = 0; i < range; i++) {
        pet_selection.push(result.liked_pets[i]);
    }
    //check if this is null
    res.end(JSON.stringify(pet_selection));
});
//needs both the user id and the range
app.get('/user/id/favoriteshelters/view', checkLoggedIn(), async (req,res) => {
    let database = client.db('petIt');
    let query = {"user_id": req.query.username};
    let result = await database.collection("users").findOne(query);
    let i;
    const shelter_selection = [];    
    const range = (result.liked_shelters.length > req.query.range) ? req.query.range : result.liked_shelters.length;
    for (i = 0; i < range; i++) {
        shelter_selection.push(result.liked_shelters[i]);
    }
    //check if the array is null
    res.end(JSON.stringify(shelter_selection));
});
//needs only an id to be send along
app.get('/user/id/recentlyviewedpets/view', checkLoggedIn(), async (req,res) => {
    let database = client.db('petIt');
    let query = {"user_id": req.query.username};
    let result = await database.collection("users").findOne(query);
    //we should check if this is null before sending it, I'll do it later though.
    res.end(JSON.stringify(result.viewed_pets));
});

//app.post("/pet/comments/create",express.json(), async (req,res) => {


//res.end("Comment Created") });

//favorite pets has ?user_id=0123&pet_id=0124
app.post("/user/id/favoritepets/add", checkLoggedIn(), async (req,res) => {
    let database = client.db('petIt');
    db.collection("users").updateOne(
        { "user_id": req.body.user_id},
        {$push: {"liked_pets" : req.body.pet_id} }
    );
    res.end("Added Pet to Favorites") 
});

app.post("/user/id/favoritepets/delete", checkLoggedIn(), async (req,res) => {
    let database = client.db('petIt');
    db.collection("users").updateOne(
        { "user_id": req.body.user_id},
        {$pop: {"liked_pets" : req.body.pet_id} }
    );
    res.end("Removed Pet from Favorites") 
});

app.post("/pet/create", checkLoggedIn(), async (req,res) => {
    //check if logged in
    let database = client.db("petIt");
    let requiredFields = {
        pet_name: req.body.pet_name,
        pet_location: req.body.pet_location,
        pet_id: 0,
        pet_type: req.body.pet_type,
        pet_breed: req.body.pet_breed,
        pet_about: req.body.pet_about,
        pet_health: req.body.pet_health,
        pet_comments: req.body.pet_comments,
        picture: req.body.picture,
        num_likes: req.body.num_likes
    }
    //check if all required fields are actually included...
    await database.collection("pets").insertOne(requiredFields);
    console.log(req.body);
    res.end("Pet created");
});

app.get('/getSessionUser',(req, res) => { 
    if(req.session.passport !== undefined){//return the user if it exists
        res.send(req.session.passport.user);
    }
    else{
        res.send();
    }
});
