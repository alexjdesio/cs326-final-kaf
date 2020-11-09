import pkg from "faker";
import express from "express";
import * as bodyParser from "body-parser";
const {name,internet,company,address,lorem,commerce,image} = pkg;


'use strict';

//EXPERIMENTING WITH EXPRESS.JS
const app = express(); // this is the "app"
const port = process.env.PORT || 8080;
app.use(express.json({type: ['application/json', 'text/plain']})); 

app.listen(port, () => {
      console.log('App listening at http://localhost:${port}');
});

app.use('/',express.static('./html')); //Serves static pages(index.html, search.html, etc.)

//Chat
app.get('/chat/view', (req, res) => res.end(JSON.stringify(createFakeChat()))); 
app.post('/chat/msg', bodyParser.json(), (req, res) => {
    console.log(req.body.id);
    console.log(req.body.value);
    res.send('Success')});

//Shelter Page
app.get('/shelter/view', bodyParser.json(), (req, res) => res.end(JSON.stringify(createShelterResults(type, query))));
app.post('/shelter/create', bodyParser.json(), (req, res) => res.end('Success')); 
app.post('/shelter/edit', bodyParser.json(), userEdit); 

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
            'id': i,
            'name': fakeName,
            'messages': messages
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

function userEdit(req,res){  
    //let options = req.body; 
    //console.log("Edit request, Body:",JSON.stringify(options));  
    res.send("Request received successfully.");  
}

