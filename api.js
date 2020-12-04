'use strict';
const express = require("express");
const minicrypt = require('./miniCrypt.js');
const expressSession = require('express-session'); // for managing session state
const passport = require('passport'); // handles authentication
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
const {
    MongoClient
} = require("mongodb");
const client = new MongoClient(url, {
    useUnifiedTopology: true
});
let database;
async function start() {
    await client.connect();
    database = client.db('petIt');
}
start();

//Express.js
const app = express(); // this is the "app"
const port = process.env.PORT || 8080; // we will listen on this port

//Start of Endpoints
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({
    extended: true
})); // allow URLencoded data
app.use(express.static('client'));

const strategy = new LocalStrategy(async (username, password, done) => {
    //Check if the user exists  
    if (!findUser(username)) {
        // If no such user
        console.log("user doesn't exist");
        return done(null, false, {
            'message': 'Wrong username'
        });
    }

    //Get the user associated with the username
    const check_query = {
        "username": username
    };
    const result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if (result === null) {
        console.log("user does not exist");
        return done(null, false, {
            'message': 'User does not exist'
        });
    }
    console.log(result);
    //Check if the password matches what is stored in the database for the given salt
    if (mc.check(password, result.salt, result.password)) {
        console.log("login succeeded");
        return done(null, username);
    } else {
        console.log("login failed");
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, {
            'message': 'Wrong password'
        });
    }
});

// App configuration
const session = {
    secret: process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave: false,
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
app.use(express.urlencoded({
    'extended': true
})); // allow URLencoded data

// Returns true if the user exists.
async function findUser(username) {
    //check if the username is in the database
    const check_query = {
        "username": username
    };
    const result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if (result !== null) {
        return true;
    } else {
        return false;
    }
}

// Routes
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
        console.log(req.session.passport.user); //this is the user!
    } else {
        // Otherwise, redirect to the login page.
        console.log("not authed");
        res.redirect('/login');
    }
}

//does the same functionality as checkLoggedIn but also checks that the user matches
function checkMatchedUser(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.query.username !== req.session.passport.user) {
            console.log("Invalid user match");
            res.redirect('/login');
        } else {
            next();
        }
    } else {
        res.redirect('/login');
    }
}

async function checkIfShelterAcct(req, res, next) {
    const query = {
        'username': req.session.passport.user
    };
    const result = await database.collection('users').findOne(query);
    if (result.type === 'shelter') {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/settings.html', checkMatchedUser, (req, res, next) => {
    next();
});
//For a url that you want to block, you need checkLoggedIn or checkMatched user as the first function that handles the endpoint
//and then after validation, just call next
app.get('/userhome.html', checkMatchedUser, (req, res, next) => {
    next();
});

app.get('/chat.html', checkLoggedIn, (req, res, next) => {
    next();
});
app.get('/shelterForm.html', checkLoggedIn, checkIfShelterAcct, (req, res, next) => {
    next();
});

app.get('/home', checkMatchedUser, (req, res) => res.sendFile('html/userhome.html', {
    'root': __dirname
}));

//Endpoint to return the username associated with the current session, or "" if not logged in.
app.get('/getSessionUser', (req, res) => {
    if (req.session.passport !== undefined) { //return the user if it exists
        console.log(req.session.passport.user);
        res.send(req.session.passport.user);
    } else {
        res.send();
    }

}); // returns the session user

app.post('/login', passport.authenticate('local', { // use username/password authentication
    'successRedirect': '/home', // when we login, go to /userhome
    'failureRedirect': '/login' // otherwise, back to login
}));


// Handle the URL /login (just output the login.html file).
app.get('/login', (req, res) => res.sendFile('html/login.html', {
    'root': __dirname
}));


// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out! //TODO: this has the same issue as req.isAuthenticated which is we dont know if the function is written for us
    res.redirect('/login'); // back to login
});

// Register URL
app.get('/register', (req, res) => res.sendFile('html/register.html', {
    'root': __dirname
}));

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post("/register", express.json(), async (req, res) => {
    //check if the username is in the database
    const check_query = {
        "username": req.body.username
    };
    const result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if (result !== null) {
        console.log("User already exists.");
        res.redirect('/register');
        return;
    }
    //check if any of the body fields are blank/malformed
    const requiredFields = {
        username: null,
        email: null,
        password: null,
        type: null,
    };
    for (const field of Object.keys(requiredFields)) {
        if (req.body[field] === null || req.body[field] === "") {
            console.log("Malformed Input.");
            res.redirect('/register');
            return;
        }
    }
    const add_query = req.body; //set the query to be equal to the request body

    //Hash password with salt
    const salt_hash = mc.hash(req.body.password);
    const salt = salt_hash[0];
    const hash = salt_hash[1];
    //update query to include hash + salt
    add_query["password"] = hash;
    add_query["salt"] = salt;
    add_query["liked_pets"] = [];
    add_query["liked_shelters"] = [];
    add_query["viewed_pets"] = [];
    add_query["chat"] = [];
    add_query["shelter"] = '';

    //Add the user to the database
    await database.collection("users").insertOne(add_query); // do I need to await these calls?
    console.log(req.body);
    res.redirect('/login');
});

app.post("/user/id/edit", checkLoggedIn, async (req, res) => {
    //check if the username is in the database
    const check_query = {
        "username": req.body.username
    };

    if (req.session.passport === null) {
        res.redirect("/login.html");
        res.end();
        return;
    }
    if (req.body.username !== req.session.passport.user) {
        console.log("You're not", req.session.passport.user, "!");
    }

    const result = await database.collection("users").findOne(check_query); // do I need to await these calls?
    if (result === null) {
        console.log("User does not exist.");
        res.end("User does not exist.");
        return;
    }
    //check if any of the body fields are blank/malformed
    const requiredFields = {
        username: null,
        email: null,
        type: null,
    };
    for (const field of Object.keys(requiredFields)) {
        if (req.body[field] === null || req.body[field] === "") {
            console.log("Malformed Input.");
            res.end("Malformed Input.");
            return;
        }
    }
    //Edit the existing user data
    const edit_query = req.body;
    edit_query["password"] = result.password;
    edit_query["salt"] = result.salt;
    edit_query["shelter"] = result.shelter;
    edit_query["chat"] = result.chat;
    if (req.body.liked_pets === '') {
        edit_query.liked_pets = [];
    }
    if (req.body.liked_shelters === '') {
        edit_query.liked_shelters = [];
    }
    if (req.body.viewed_pets === '') {
        edit_query.viewed_pets = [];
    }

    await database.collection("users").findOneAndReplace(check_query, edit_query);
    res.end();
    return;
});

app.get('/search', express.urlencoded(), async (req, res) => {
    //Make sure this is a valid search request
    const requiredFields = {
        type: null,
        query: null,
        quantity: null,
    };
    for (const field of Object.keys(requiredFields)) {
        if (req.query[field] === null) {
            res.end("Invalid request- missing type, query, or quantity field.");
            return;
        }
    }
    const petFields = {
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
    const shelterFields = {
        shelter_name: null,
        shelter_location: null,
        shelter_about: null,
        shelter_pets: null,
        shelter_comments: null,
        picture: null
    };
    //Figure out if this search will be in the pet or shelter collection
    if (req.query.type === null) {
        res.end("Invalid query- missing type field.");
    }
    let collection_type = "pets";
    if (req.query.type in petFields) {
        collection_type = "pets";
    } else if (req.query.type in shelterFields) {
        collection_type = "shelters";
    } else {
        res.end("Invalid query- invalid type value.");
    }
    const query = {};
    query[req.query.type] = req.query.query;
    const result = [];
    await database.collection(collection_type).find(query, {
        limit: parseInt(req.query.quantity)
    }).forEach((x) => result.push(x));
    console.log("Search request returned: ", result);
    res.end(JSON.stringify(result));
});

app.get('/user/id/view', checkMatchedUser, async (req, res) => {
    const query = {
        "username": req.query.username
    };
    const result = await database.collection("users").findOne(query);
    console.log("View request returned", result);
    res.end(JSON.stringify(result));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.get('/pet/view', async (req, res) => {
    const query = {
        "pet_id": req.query.pet_id
    };
    const result = await database.collection("pets").findOne(query);
    if (result === null) {
        res.end("No pet found");
    } else {
        res.end(JSON.stringify(result));
    }
});

//Checks If Already Favorited Endpoint
app.get('/user/id/checkfavorites', checkLoggedIn, async (req, res) => {
    //args: id=&username=&type=
    let query;
    if (req.query.type === 'pet') {
        query = {
            "username": req.query.username,
            liked_pets: req.query.id
        };
    } else if (req.query.type === 'shelter') {
        query = {
            "username": req.query.username,
            liked_shelters: req.query.id
        };
    } else {
        res.end("Incorrect type requested");
    }

    const result = await database.collection("users").findOne(query);
    if (result === null) {
        res.end("Not in favorites");
    } else {
        res.end("In favorites");
    }
});

//Get User's Favorite Pets Endpoint
app.get('/user/id/favoritepets/view', checkLoggedIn, async (req, res) => {
    const query = {
        "username": req.query.username
    };
    const result = await database.collection("users").findOne(query);
    if (result !== null) {
        console.log(result.liked_pets);
    }
    let i;
    const pet_selection = [];

    const range = (result.liked_pets.length > req.query.range) ? req.query.range : result.liked_pets.length;
    for (i = 0; i < range; i++) {
        pet_selection.push(result.liked_pets[i]);
    }
    //check if this is null
    res.end(JSON.stringify(pet_selection));
});

//Get User's Favorite Shelters Endpoint
app.get('/user/id/favoriteshelters/view', checkLoggedIn, async (req, res) => {
    const query = {
        "username": req.query.username
    };
    const result = await database.collection("users").findOne(query);
    let i;
    const shelter_selection = [];
    const range = (result.liked_shelters.length > req.query.range) ? req.query.range : result.liked_shelters.length;
    for (i = 0; i < range; i++) {
        shelter_selection.push(result.liked_shelters[i]);
    }
    //check if the array is null
    res.end(JSON.stringify(shelter_selection));
});

//Get Recently Viewed Pets Endpoint
app.get('/user/id/recentlyviewedpets/view', checkLoggedIn, async (req, res) => {
    const query = {
        "username": req.query.username
    };
    const result = await database.collection("users").findOne(query);
    //we should check if this is null before sending it, I'll do it later though.
    res.end(JSON.stringify(result.viewed_pets));
});

//Favorite Pet Endpoint 
app.post("/user/id/favoritepets/add", checkLoggedIn, async (req, res) => {
    await database.collection("users").updateOne({
        "username": req.body.username
    }, {
        $push: {
            "liked_pets": req.body.pet_id
        }
    });
    res.end("Added Pet to Favorites");
});

//Unfavorite Pet Endpoint 
app.post("/user/id/favoritepets/delete", checkLoggedIn, async (req, res) => {
    console.log("REMOVING??? this id:");
    console.log(req.body.pet_id);
    await database.collection("users").updateOne({
        "username": req.body.username
    }, {
        $pull: {
            "liked_pets": req.body.pet_id
        }
    });
    res.end("Removed Pet from Favorites");
});

//Create New Pet Endpoint
app.post("/pet/create", checkLoggedIn, async (req, res) => {
    //check if logged in
    const pet_id = await getID('pet');
    const requiredFields = {
        pet_name: req.body.pet_name,
        pet_location: req.body.pet_location,
        pet_id: pet_id,
        pet_type: req.body.pet_type,
        pet_breed: req.body.pet_breed,
        pet_about: req.body.pet_about,
        pet_health: req.body.pet_health,
        pet_comments: req.body.pet_comments,
        picture: req.body.picture,
        num_likes: req.body.num_likes
    };
    //check if all required fields are actually included...
    await database.collection("pets").insertOne(requiredFields);

    await database.collection('shelters').updateOne({
        shelter_id: req.body.pet_location
    }, {
        $push: {
            shelter_pets: pet_id
        }
    });
    res.end("Pet created");
});

//Get Chat Endpoint
app.get('/chat/view', checkLoggedIn, async (req, res) => {
    const query = {
        'username': req.session.passport.user
    };
    const result = await database.collection('users').findOne(query);
    res.end(JSON.stringify(result.chat));
});

//Post Chat Message Endpoint
app.post('/chat/msg', checkLoggedIn, async (req, res) => {
    const query = {
        'username': req.session.passport.user
    };
    const result = await database.collection('users').findOne(query);
    const msg = {
        key: '0',
        value: req.body.value
    };
    let noContact = true;
    const chat = result.chat;

    const query2 = {
        'username': req.body.fromUsername
    };
    const result2 = await database.collection('users').findOne(query2);
    if (result2 === null) {
        res.end('No users found');
        return;
    }
    const msg2 = {
        key: '1',
        value: req.body.value
    };
    const chat2 = result2.chat;

    for (const x in chat) {
        if (chat[x].fromUsername === req.body.fromUsername) {
            chat[x].messages.push(msg);
            noContact = false;
            break;
        }
    }
    for (const x in chat2) {
        if (chat2[x].fromUsername === req.session.passport.user) {
            chat2[x].messages.push(msg2);
            break;
        }
    }

    if (noContact === true) {
        chat.push({
            fromUsername: req.body.fromUsername,
            messages: [msg]
        });
        chat2.push({
            fromUsername: req.session.passport.user,
            messages: [msg2]
        });
        res.send('Success');
    }
    await database.collection('users').updateOne(query, {
        $set: {
            'chat': chat
        }
    });
    await database.collection('users').updateOne(query2, {
        $set: {
            'chat': chat2
        }
    });
    res.end('Success');
});

//Post New Shelter Endpoint
app.post('/shelter/create', async (req, res) => {
    const id = await getID('shelter');
    const shelter = {
        shelter_name: req.body.shelter_name,
        shelter_id: id,
        shelter_location: req.body.shelter_location,
        shelter_about: req.body.shelter_about,
        shelter_pets: [],
        shelter_comments: [],
        picture: req.body.picture,
        banner_picture: req.body.banner_picture,
        location_picture: req.body.location_picture
    };
    const col = database.collection('shelters');
    await col.insertOne(shelter);
    res.end('Success');
});

//Get Shelter Endpoint
app.get('/shelter/view', async (req, res) => {
    const query = {
        'shelter_id': req.query.shelter_id
    };
    const result = await database.collection('shelters').findOne(query); // do I need to await these calls?
    res.end(JSON.stringify(result));
});

//Favorite Shelter Endpoint
app.post("/user/id/favoriteShelters/add", checkLoggedIn, async (req, res) => {
    await database.collection("users").updateOne({
        "username": req.body.username
    }, {
        $push: {
            "liked_shelters": req.body.shelter_id
        }
    });
    res.end("Added Pet to Favorites");
});

//Unfavorite Shelter Endpoint
app.post("/user/id/favoriteShelters/delete", checkLoggedIn, async (req, res) => {
    await database.collection("users").updateOne({
        "username": req.body.username
    }, {
        $pull: {
            "liked_shelters": req.body.shelter_id
        }
    });
    res.end("Removed Pet from Favorites");
});

//Create Pet Comments Endpoint
app.post("/pet/comments/create", async (req, res) => {
    let user;
    try {
        user = req.session.passport.user;
    } catch (error) {
        user = 'Anonymous';
    }
    const query = {
        'pet_id': req.body.pet_id
    };
    const comment = {
        'username': user,
        'value': req.body.value
    };
    const col = database.collection('pets');
    await col.updateOne(query, {
        $push: {
            'pet_comments': comment
        }
    });
    res.end('Success');
});

//Create Shelter Comments Endpoint
app.post("/shelter/comments/create", async (req, res) => {
    let user;
    try {
        user = req.session.passport.user;
    } catch (error) {
        user = 'Anonymous';
    }
    const query = {
        'shelter_id': req.body.shelter_id
    };
    const comment = {
        'username': user,
        'value': req.body.value
    };
    const col = database.collection('shelters');
    await col.updateOne(query, {
        $push: {
            'shelter_comments': comment
        }
    });
    res.end('Success');
});

//ID generation for shelter and pets
async function getID(type) {
    const col = database.collection('idCounter');
    await col.updateOne({
        type: type
    }, {
        $inc: {
            idCount: 1
        }
    });
    const result = await col.findOne({
        type: type
    });
    const string = String(result.idCount);
    return string;
}

//Don't move this or redirects won't work
app.use(express.static('html'));