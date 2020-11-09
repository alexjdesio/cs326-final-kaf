'use strict';

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
