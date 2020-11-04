import pkg from "faker";
import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFile, readFileSync, existsSync} from 'fs';
const {name,internet,company,address,lorem,commerce} = pkg;

'use strict';

function createFakeUser(username){
    let interestIndex = Math.floor((Math.random()*3))
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
        location: address.city()
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
        pet_comments: []
    };
    let fields = Object.keys(pet);
    if(fields.includes(type)){ //guarantees that the fake data satisfies the search constraints
        pet[type] = query;
    }
    return pet;
}

function createFakeShelterResult(type,query){
    let shelter = {
        shelter_name: company.companyName(),
        shelter_location: company.companyName(),
        shelter_about: lorem.sentence(5,10),
        shelter_pets: null,
        shelter_comments: []
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

/**
 * Example queries:
 * POST(not-browser):
    * http://127.0.0.1:8080/login
    * http://127.0.0.1:8080/register
    * http://127.0.0.1:8080/user/id/edit
 * GET:
    * http://127.0.0.1:8080/search?type=pet_location&query=Boston&quantity=2
    * http://127.0.0.1:8080/user/id/view
 */

let server = createServer((request, response) => {	
	if (request.method === 'GET') {
		const options = parse(request.url, true).query;
		process(request, response, options);
	} else {
		let requestBody = "";
		request.on('data', function (data) {
			requestBody += data;
		});
		request.on('end', function () {
        console.log("Before ",requestBody);
        const options = JSON.parse(requestBody); //getting an error here- JSON.parse is upset
        console.log("After ", options);
		process(request, response, options);
		});
	}
});
server.listen(8080);

function process(request,res,options){
    const headerText = {"Content-Type" : "text/json"};
    res.writeHead(200, headerText);
    const parsed = parse(request.url, true);
    if (parsed.pathname === '/register') {
        //database.users.push(options); //Causes issues, 'Cannot read property 'push' of undefined'
        res.end();
    }
    else if (parsed.pathname === '/login') {
        if((options.username === null) || (options.password === null)){
            //validates that sufficient information was passed in for the login attempt to occur
            res.end("Login attempt failed- Invalid request.")
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
    else if (parsed.pathname === '/search') { 
        res.end(JSON.stringify(createFakeSearchResult(options.type,options.query,options.quantity)));
    }
    else if (parsed.pathname === '/user/id/view') {
        res.end(JSON.stringify(createFakeUser(options.username))); //this works!
    }
    else if(parsed.pathname === '/user/id/edit') {
        let users = database.users;
        let updatedUser = {};
        for(let user of users){
            if(user.username === options.username){
                let fields = Object.keys(user);
                for (let field of fields){ //update all fields that have changed
                    user[field] = (options[field] !== null) ? options[field] : user[field];
                }
                updatedUser = user;
                res.end(JSON.stringify(updatedUser));
                return;  
            }
        }
        res.end("No user found.");
    }
    else {
        // If the client did not request an API endpoint, we assume we need to fetch and serve a file.
        // This is terrible security-wise, since we don't check the file requested is in the same directory.
        // This will do for our purposes.
        const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
        //const path = join("client/", filename);
        const path = filename;
        console.log("trying to serve " + path + "...");
        if (existsSync(path)) {
            if (filename.endsWith("html")) {
                res.writeHead(200, {"Content-Type" : "text/html"});
            }
            else if (filename.endsWith("css")) {
                res.writeHead(200, {"Content-Type" : "text/css"});
            }
            else if (filename.endsWith("js")) {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
            }

            res.write(readFileSync(path));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }
}

/** May need this part for serving files
createServer(async (req, res) => {
    const parsed = parse(req.url, true);
    if (parsed.pathname === '/highestGameScores') {
        res.end(JSON.stringify(
            database.gameScores.sort((a, b) => b.score - a.score).filter((v, i) => i < 10)
        ));
    else {
        // If the client did not request an API endpoint, we assume we need to fetch and serve a file.
        // This is terrible security-wise, since we don't check the file requested is in the same directory.
        // This will do for our purposes.
        const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
        //const path = join("client/", filename);
        console.log("trying to serve " + path + "...");
        if (existsSync(path)) {
            if (filename.endsWith("html")) {
                res.writeHead(200, {"Content-Type" : "text/html"});
            }
            else if (filename.endsWith("css")) {
                res.writeHead(200, {"Content-Type" : "text/css"});
            }
            else if (filename.endsWith("js")) {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
            }

            res.write(readFileSync(path));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }
}).listen(8080);
**/
