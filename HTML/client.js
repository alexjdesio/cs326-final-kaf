'use strict';

//This is the only function that should be called- it will decide which other functions need to load
function generateDynamicHTML(){
    const url_string = window.location.href;
    const url = new URL(url_string);
    const name = url.searchParams.get("name");
    const page = url.pathname;
    console.log(name,page);
    if(page === "/settings.html"){
        const username = url.searchParams.get("username");
        if(username !== null){
            getUserResults(username);
        }
        let form = document.getElementById("settings-form");
        let submit = document.getElementById("settings-submit");
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendFormData();
        });   
    }
    else if (page === "/search.html"){
        let type = url.searchParams.get("type");
        let query = url.searchParams.get("query");
        let quantity = 10; //this could be modified to become more dynamic- for example, add event listener to increase num of results on click
        getSearchResults(type,query,quantity);
    }
    else if (page === "/signup.html"){
        let form = document.getElementById("signup-form");
        let submit = document.getElementById("signup-submit");
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendFormData();
        });
    }
    else if (page === "/login.html"){
        let form = document.getElementById("login-form");
        let submit = document.getElementById("login-submit");
        form.addEventListener("submit",function (event){
            event.preventDefault(); //this is so important, prevents default form submission behavior
            sendFormData();
        });
    }
    
}

async function sendFormData(){
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
    let fields = Object.keys(userData);
    for(let field of fields){
        if(document.getElementById(field) !== null){
            userData[field] = document.getElementById(field).value;
        }
    }
    //console.log(JSON.stringify(userData));
    
    const response = await fetch("http://127.0.0.1:8080/user/id/edit", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(userData)
    });
    if(response.ok){
        console.log("Edit response successfully sent to server.");
    } 
}


generateDynamicHTML(); //enables dynamically-generated HTML
