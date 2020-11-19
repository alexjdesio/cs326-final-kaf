//import {createFakeUser,createFakeLogin} from "./api.js";

'use strict';

/**
 * Example queries:
 * POST(not-browser):
    * http://127.0.0.1:8080/login
    * http://127.0.0.1:8080/register
    * http://127.0.0.1:8080/user/id/edit
 * GET:
    * http://127.0.0.1:8080/search?type=pet_location&query=Boston&quantity=2
    * http://127.0.0.1:8080/user/id/view
    * 
    * http://127.0.0.1:8080/settings.html?username=Theo
*/
    
async function getSearchResults(type,query,quantity){
    let request_url = "/search?type=" + type + "&query=" + query + "&quantity=" + quantity;
    let response = await fetch(request_url, {method:"GET"});
    let fieldClasses = {
        pet_name: "card-title",
        shelter_name: "card-title",
        picture: "format-picture"
    };
    let fieldElements = {
        pet_name: "a",
        pet_breed: "p",
        shelter_name: "h3",
        picture: "img"
    };
    let labels = {
        pet_breed: "Breed: ",
        pet_about: "About: ",
        pet_comments: "Comments: ",
        pet_health: "Health: "
    };
    if(response.ok){
        let results = await response.json();
        const search_container = document.getElementById("search-results");
        console.log(search_container);
        for(let result of results){
            const newCard = document.createElement("div");
            const newResultDiv = document.createElement("div");
            newCard.classList.add("card");
            newResultDiv.classList.add("card-body");
            newCard.append(newResultDiv);
            for(let field of Object.keys(result)){
                let elementType = "p";
                if(field in fieldElements){ //define the element type with a default of <p>
                    elementType = fieldElements[field];
                }
                const newField = document.createElement(elementType);
                if(elementType === "img"){
                    newField.src = result[field];
                    newField.width = 268;
                    newField.height = 200;
                }
                else{
                    if(field in labels){
                        newField.textContent = labels[field] + result[field];
                    }
                    else{
                        newField.textContent = result[field];
                    }   
                }
                newResultDiv.append(newField);
                let classIdentifier = "card-text";
        
                if(field in fieldClasses){//add the class identifier if this field has one
                    classIdentifier = fieldClasses[field];
                }
                newField.classList.add(classIdentifier);
                newField.classList.add(field);

                //generates appropriate links for <a> tags, needs to be updated when merging code on Friday
                if(field === "pet_name"){
                    newField.href = "/petpage.html?name=" + result[field]; //may need to change name of this field
                }
                else if(field === "shelter_name"){
                    newField.href = "/shelterPage.html?name=" + result[field]; //may need to change name of this field
                }
            } 
            search_container.append(newCard);
        }
    }
    else{
        console.log("Request for search results failed:", type, query, quantity);
    }
 }

//getSearchResults("pet_location","Boston","5");


async function getUserResults(username){
    let viewUserUrl = "/user/id/view?username=" + username;
    const response = await fetch(viewUserUrl,{method:"GET"});
    if(response.ok){
        let result = await response.json();
        if(result === null){
            return;
        }
        console.log("User view request successful.");
        document.getElementById("username").textContent = "Modify Settings for: " + result["username"]; 
        //update value fields
        for(let field of Object.keys(result)){
            if(field !== "password" && field !== "type" && field !=="interests"){
                let element = document.getElementById(field);
                if(element !== null){
                    element.value = result[field];
                } 
            }
        }
        //update checkboxes for user type
        let type_elements = document.getElementsByName("type");
        for(let type_element of type_elements){
            type_element.checked = (type_element.value === result.type) ? true : false;
        }
        //update checkboxes for user interests
        let interest_elements = document.getElementsByName("interests");
        for(let interest_element of interest_elements){
            //console.log("Comparing ", interest_element.value, " with ", result.interests);
            interest_element.checked = (interest_element.value === result.interests) ? true : false;
        }   
    }
}

//TESTING:

//Experimental function, may be removed
async function editUserSettings(){
    let userData = {
        username: null,
        email: null, 
        password: null,
        type: null,
        interests: null,
        shelter: null,
        liked_pets: null,
        viewed_pets: null,
        location: null
    };
    for(let field of Object.keys(userData)){
        let currField = document.getElementById(field);
        userData[field] = (currField !== null) ? currField.value : null;
    }
    console.log(userData);
    const response = await fetch("/user/id/edit", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(userData)
    }); 
    if(response.ok){
        //let result = response.json();
        //console.log("Edit to user data successfully submitted.\nResponse:", JSON.stringify(result));
    }
    return;
}

//Chat Client
async function renderChat(){
    let viewUserUrl = "/chat/view";
    const response = await fetch(viewUserUrl, {
        method: 'GET'});
    if(response.ok){
        let result = await response.json();
        const chatUsers = document.getElementById('chatUsers');

        for (let x in result){
            let results = result[x];

            const button = document.createElement('button');
            button.innerText = results.name;
            button.addEventListener('click', () => {
                const chatMessages = document.getElementById('chatMessages');
                while (chatMessages.firstChild){
                    chatMessages.removeChild(chatMessages.lastChild);
                }

                let messages = results.messages;
                for (let y of messages){
                    const message = document.createElement('p');
                    message.innerText = y.value;
                    message.classList.add('border', 'rounded', 'bg-white');
                    if (y.key === 1){
                        message.classList.add('alignToRight');
                    } 
                chatMessages.appendChild(message);
                }
            });
            chatUsers.appendChild(button);
        }
    }
}

async function renderOneChat(id){
    let viewUserUrl = "/chat/view";
    const response = await fetch(viewUserUrl, {
        method: 'GET'});
    if(response.ok){
        let result = await response.json();
        const chatUsers = document.getElementById('chatUsers');
        let results = result[id]; 
        const messages = results.messages;
        while (chatMessages.firstChild){
            chatMessages.removeChild(chatMessages.lastChild);
        }
        for (let y of messages){
            const message = document.createElement('p');
            message.innerText = y.value;
            message.classList.add('border', 'rounded', 'bg-white');
            if (y.key === 1){
                message.classList.add('alignToRight');
            }
        chatMessages.appendChild(message);
        }         
    }
}

//Shelter Client
async function renderShelter(name){
    let viewUserUrl = "/shelter/view";
    const response = await fetch(viewUserUrl, {
        method: 'GET'});
    if(response.ok){
        const results = await response.json();
        document.getElementById('nameOrg').innerText = results.shelter_name;
        document.getElementById('nameOrg2').innerText = results.shelter_name;
        document.getElementById('aboutOrg').innerText = results.shelter_about;
        document.getElementById('aboutOrg2').innerText = results.shelter_about;
        
        const recentList = document.getElementById('recentPet');
        for (let i = 0; i < 5; ++i){
            const post = document.createElement('div');
            post.classList.add('col', 'card');
            recentList.appendChild(post);
            const img = document.createElement('img');
            img.classList.add('img-thumbnail', 'imgCrop');
            img.src = results.shelter_pets[i].picture;
            post.appendChild(img);
            const header = document.createElement('h5');
            header.innerText = results.shelter_pets[i].pet_name;
            post.appendChild(header);
        }
    }
}

//This is the only function that should be called- it will decide which other functions need to load
function generateDynamicHTML(){
    const url_string = window.location.href;
    const url = new URL(url_string);
    const name = url.searchParams.get("name");
    const page = url.pathname;
    console.log(name,page);
    if(page === "/settings.html" || page === "/settings"){
        const username = url.searchParams.get("username");
        if(username !== null && username !== ''){
            getUserResults(username);
        }
        let form = document.getElementById("settings-form");
        let submit = document.getElementById("settings-submit");
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendFormData("edit");
        });   
    }
    else if (page === "/search.html"){
        let type = url.searchParams.get("type");
        let query = url.searchParams.get("query");
        let quantity = 10; //this could be modified to become more dynamic- for example, add event listener to increase num of results on click
        getSearchResults(type,query,quantity);
    }
    else if (page === "/signup.html"){
        console.log("signup request sent");
        let form = document.getElementById("signup-form");
        let submit = document.getElementById("signup-submit");
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendFormData("register");
        });
    }
    else if (page === "/login.html" || page === "/login"){
        console.log("login request sent");
        let form = document.getElementById("login-form");
        let submit = document.getElementById("login-submit");
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendFormData("login");
        });
    }
     else if (page === '/chat.html'){
        let form = document.getElementById('chatForm');
        let submit = document.getElementById('chatSubmit');
        renderChat();
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendChatData();
            document.getElementById('chatField').value = '';
            renderOneChat(0);
        });
    }
    else if (page ==='/shelterPage.html'){
        let name = url.searchParams.get('name');
        renderShelter(name); 
    }
}

async function sendChatData(){
    let viewUserUrl = "/chat/msg";
    const response = await fetch(viewUserUrl, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            id: 0, 
            value: document.getElementById('chatField').value
        })
    });

    if(!response.ok){
        console.log(response.error);
    }
}

//arg1 determines if this is an edit or register or login
async function sendFormData(arg1){
    let userData = {
        username: null,
        email: null, 
        password: null,
        type: null,
        interests: null,
        shelter: '',
        liked_pets: '',
        viewed_pets: '',
        location: null
    };
    let fields = Object.keys(userData);
    for(let field of fields){
        if(document.getElementById(field) !== null){
            userData[field] = document.getElementById(field).value;
        }
    }
    //console.log(JSON.stringify(userData));
    if(arg1 === "edit"){
        const response = await fetch("/user/id/edit", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(userData)
        });
        if(response.ok){
            console.log("Edit response successfully sent to server.");
        } 
        window.location.href="/userhome.html";
    }
    else if (arg1 === "register"){
        const response = await fetch("/register", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(userData)
        });
        if(response.ok){
            console.log("Edit response successfully sent to server.");
        } 
        window.location.href="/login.html";
    }
    else if (arg1 === "login"){
        console.log("sending POST request to /login");
        const response = await fetch("/login", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(userData)
        });
        if(response.ok){
            console.log("Login response successfully sent to server.");
        } 
        window.location.href="/userhome.html"; //this is the alternative method
    }
}


generateDynamicHTML(); //enables dynamically-generated HTML
