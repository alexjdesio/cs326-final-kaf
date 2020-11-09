import pkg from 'faker';
import {createServer} from 'http';
import {parse} from 'url';
import * as bodyParser from "body-parser";
//const bodyParser = require('body-parser');
import express from "express";

//import {join} from 'path';
//import {writeFile, readFileSync, existsSync} from 'fs';
const {name,internet,company,address,lorem,commerce,image} = pkg;

'use strict';

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

//function process(request,res,options) {
//    const headerText = {"Content-Type" : "text/json"};
//    res.writeHead(200, headerText);
//    const parsed = parse(request.url, true);
//    if (parsed.pathname === '/pet/view') {
        //
//        res.end(JSON.stringify(createFakePet(options.name)));
//    } else if (parsed.pathname === '/shelter/view') {
//        res.end(JSON.stringify(createFakeShelter(options.name)));
//    } else if (parsed.pathname === '/pet/create') {
        //we would create this, not necessary for now.
//        res.end();
//    } else if (parsed.pathname === '/user/favoritepets/view') {
//        res.end(JSON.stringify(favoritePets(options.range)));
//    } else if (parsed.pathname === '/user/favoriteshelters/view') {
//       res.end(JSON.stringify(favoriteShelters(options.range)));
//    } else if (parsed.pathname === '/user/favoritepets/delete') {
        //this needs to modify both the pet and the user! eventually...
//        res.end();
//    } else if (parsed.pathname === '/user/favoritepets/add') {
        //this needs to modify both the pet and the user!
//        res.end();
//    } else if (parsed.pathname === '/user/recentlyviewedpets') {
//        res.end(JSON.stringify(recentlyViewedPets()));
//    } else {
//        res.end();
//    }
//}

/**
const server = createServer((request, response) => {	
	if (request.method === 'GET') {
		const options = parse(request.url, true).query;
		process(request, response, options);
	} else {
		let requestBody = "";
		request.on('data', function (data) {
			requestBody += data;
		});
		request.on('end', function () {
		const options = JSON.parse(requestBody);
		process(request, response, options);
		});
	}
});
server.listen(8080);
**/
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log('App listening at http://localhost:${port}');
});

app.use('/',express.static('./html')); //Serves static pages(index.html, search.html, etc.)

//app.get('/search',bodyParser.urlencoded(),search);

app.get('/pet/view',express.json(), (req,res) => res.end(JSON.stringify(createFakePet(req.query.name))));

app.get('/shelter/view',express.json(), (req,res) => res.end(JSON.stringify(createFakeShelter(req.query.name))));

app.get('/user/id/favoritepets/view',express.json(), (req,res) => res.end(JSON.stringify(favoritePets(req.query.range))));

app.get('/user/id/favoriteshelters/view',express.json(), (req,res) => res.end(JSON.stringify(favoriteShelters(req.query.range))));

app.get('/user/id/recentlyviewedpets',express.json(), (req,res) => res.end(JSON.stringify(recentlyViewedPets())));

app.post("/pet/comments/create",express.json(), (req,res) => res.end("Comment Recieved"));

app.post("/user/id/favoritepets/add",express.json(), (req,res) => res.end("Added Pet to Favorites"));

app.post("/user/id/favoritepets/delete",express.json(), (req,res) => res.end("Removed Pet from Favorites"));

app.post("/pet/create",express.json(), (req,res) => res.end("Info Recieved."));

//app.post("/pet/create",bodyParser.json(), (req,res) => res.end("Info Recieved."));


//app.post("/login",bodyParser.json(),login); //should be POST, works when set to GET

//app.post("/user/id/edit",bodyParser.json(),userEdit);






